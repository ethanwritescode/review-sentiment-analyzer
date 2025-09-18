export type FastSentimentResult = {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
};

export type EmbeddingAnalysisResult = {
  reviews: Array<{
    text: string;
    index: number;
    sentiment: FastSentimentResult;
    coordinates: { x: number; y: number };
  }>;
};

import { AnchorManager, type AnchorEmbeddings } from './anchorManager';
import { DEFAULT_SENTIMENT_ANCHORS, type SentimentAnchors } from '../config/sentimentAnchors';

export class EmbeddingSentimentAnalyzer {
  private anchorManager = new AnchorManager();
  private anchorEmbeddings: AnchorEmbeddings | null = null;
  private currentAnchors: SentimentAnchors = DEFAULT_SENTIMENT_ANCHORS;


  async initialize(customAnchors?: SentimentAnchors): Promise<void> {
    const anchorsToUse = customAnchors || this.currentAnchors;
    this.currentAnchors = anchorsToUse;
    this.anchorEmbeddings = await this.anchorManager.getAnchorEmbeddings(anchorsToUse);
  }


  async analyzeSentiment(texts: string[], customAnchors?: SentimentAnchors): Promise<EmbeddingAnalysisResult> {
    await this.initialize(customAnchors);
    
    const reviewEmbeddings = await this.getEmbeddings(texts);
    
    const results = reviewEmbeddings.map((embedding, index) => {
      const sentiment = this.classifySentiment(embedding);
      
      return {
        text: texts[index],
        index,
        sentiment,
        coordinates: { x: 0, y: 0 }
      };
    });

    results.forEach((result) => {
      const sentiment = result.sentiment.sentiment;
      const confidence = result.sentiment.confidence;
      
      let baseX = 0;
      if (sentiment === 'positive') {
        baseX = 2;
      } else if (sentiment === 'negative') {
        baseX = -2;  
      } else {
        baseX = 0;
      }
      
      const baseY = (confidence - 0.5) * 3;
      
      const jitterX = (Math.random() - 0.5) * 1.2;
      const jitterY = (Math.random() - 0.5) * 0.8;
      
      result.coordinates = {
        x: baseX + jitterX,
        y: baseY + jitterY
      };
    });
    
    return {
      reviews: results
    };
  }


  private classifySentiment(embedding: number[]): FastSentimentResult {
    if (!this.anchorEmbeddings) {
      throw new Error('Anchor embeddings not initialized. Call initialize() first.');
    }

    // multi-scale ensemble analysis
    const ensembleResult = this.performMultiScaleAnalysis(embedding);
    
    return ensembleResult;
  }

  /**
   * multi-scale analysis w/ different similarity emphasis levels
   */
  private performMultiScaleAnalysis(embedding: number[]): FastSentimentResult {
    const scales = [0.5, 1.0, 2.0]; // Different emphasis levels for weighting
    const results: Array<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; similarities: { positive: number; negative: number; neutral: number } }> = [];
    
    // analyze at different scales
    for (const scale of scales) {
      const similarities = {
        positive: this.calculateScaledSimilarity(embedding, this.anchorEmbeddings!.positive, scale),
        negative: this.calculateScaledSimilarity(embedding, this.anchorEmbeddings!.negative, scale),
        neutral: this.calculateScaledSimilarity(embedding, this.anchorEmbeddings!.neutral, scale)
      };

      const result = this.classifyWithAdaptiveThreshold(similarities);
      results.push({ ...result, similarities });
    }
    
    // ensemble the results
    return this.ensembleResults(results);
  }

  /**
   * calculate similarity
   */
  private calculateScaledSimilarity(embedding: number[], anchors: number[][], scale: number): number {
    const similarities = anchors.map(anchor => this.cosineSimilarity(embedding, anchor));
    
    // apply scaling to the weighting function
    const weights = similarities.map(sim => Math.pow(Math.max(0, sim), scale * 2));
    const weightedSum = similarities.reduce((sum, sim, i) => sum + sim * weights[i], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * classify w/ adaptive thresholding for better neutral detection
   */
  private classifyWithAdaptiveThreshold(similarities: { positive: number; negative: number; neutral: number }): { sentiment: 'positive' | 'negative' | 'neutral'; confidence: number } {
    const scores = Object.values(similarities);
    const sortedEntries = Object.entries(similarities).sort(([,a], [,b]) => b - a);
    const maxSentiment = sortedEntries[0][0] as 'positive' | 'negative' | 'neutral';
    const maxScore = sortedEntries[0][1];
    const secondScore = sortedEntries[1][1];
    
    // dynamic threshold based on overall similarity levels and score distribution
    const avgSimilarity = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const scoreRange = Math.max(...scores) - Math.min(...scores);
    
    // adaptive threshold: higher when scores are close, lower when there's clear separation
    const baseThreshold = 0.02; // minimum separation needed
    const adaptiveThreshold = baseThreshold + (0.05 * (1 - scoreRange)); // increase threshold when scores are similar
    
    // if the difference between top two scores is too small, classify as neutral with low confidence
    if (maxScore - secondScore < adaptiveThreshold) {
      return { 
        sentiment: 'neutral', 
        confidence: Math.max(0.1, avgSimilarity * 0.5) // low confidence neutral
      };
    }
    
    // if neutral has highest score and it's above average, boost neutral classification
    if (maxSentiment === 'neutral' && maxScore > avgSimilarity * 1.1) {
      const confidence = this.calculateEnhancedConfidence(similarities);
      return { sentiment: 'neutral', confidence: Math.min(0.9, confidence * 1.2) };
    }
    
    // for non-neutral classifications check if the score is very high above neutral
    if (maxSentiment !== 'neutral') {
      const neutralScore = similarities.neutral;
      const sentimentAdvantage = maxScore - neutralScore;
      
      // if sentiment advantage is small reduce confidence
      if (sentimentAdvantage < 0.03) {
        const confidence = this.calculateEnhancedConfidence(similarities) * 0.8;
        return { sentiment: maxSentiment, confidence };
      }
    }
    
    const confidence = this.calculateEnhancedConfidence(similarities);
    return { sentiment: maxSentiment, confidence };
  }

  /**
   * ensemble multiple analysis results w/ weighted voting
   */
  private ensembleResults(results: Array<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; similarities: { positive: number; negative: number; neutral: number } }>): FastSentimentResult {
    // weight each result by its confidence
    const sentimentVotes: { positive: number; negative: number; neutral: number } = { positive: 0, negative: 0, neutral: 0 };
    let totalWeight = 0;
    
    results.forEach(result => {
      const weight = result.confidence;
      sentimentVotes[result.sentiment] += weight;
      totalWeight += weight;
    });
    
    // normalize votes
    if (totalWeight > 0) {
      sentimentVotes.positive /= totalWeight;
      sentimentVotes.negative /= totalWeight;
      sentimentVotes.neutral /= totalWeight;
    }
    
    // find winning sentiment
    const maxSentiment = Object.entries(sentimentVotes).reduce((a, b) => 
      sentimentVotes[a[0] as keyof typeof sentimentVotes] > sentimentVotes[b[0] as keyof typeof sentimentVotes] ? a : b
    )[0] as 'positive' | 'negative' | 'neutral';
    
    // calculate ensemble confidence
    const maxVote = sentimentVotes[maxSentiment];
    const otherVotes = Object.values(sentimentVotes).filter(vote => vote !== maxVote);
    const avgOtherVote = otherVotes.reduce((sum, vote) => sum + vote, 0) / otherVotes.length;
    
    // enhanced ensemble confidence considering vote separation and individual confidences
    const voteSeparation = maxVote - avgOtherVote;
    const avgConfidence = results.reduce((sum, result) => sum + result.confidence, 0) / results.length;
    const confidenceVariance = results.reduce((sum, result) => sum + Math.pow(result.confidence - avgConfidence, 2), 0) / results.length;
    const confidenceConsistency = 1 - Math.sqrt(confidenceVariance);
    
    const ensembleConfidence = Math.min(1, Math.max(0, 
      voteSeparation * 0.4 + 
      avgConfidence * 0.4 + 
      confidenceConsistency * 0.2
    ));
    
    return {
      sentiment: maxSentiment,
      confidence: ensembleConfidence
    };
  }


  private calculateAverageSimilarity(embedding: number[], anchors: number[][]): number {
    const similarities = anchors.map(anchor => this.cosineSimilarity(embedding, anchor));
    return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
  }

  /**
   * calculate weighted similarity w/ emphasis on stronger matches
   */
  private calculateWeightedSimilarity(embedding: number[], anchors: number[][]): number {
    const similarities = anchors.map(anchor => this.cosineSimilarity(embedding, anchor));
    
    // use weighted average w/ emphasis on highest similarities
    const weights = similarities.map(sim => Math.pow(Math.max(0, sim), 2)); // square to emphasize high similarities
    const weightedSum = similarities.reduce((sum, sim, i) => sum + sim * weights[i], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * confidence calculation w/ separation consistency and absolute scores
   */
  private calculateEnhancedConfidence(similarities: { positive: number; negative: number; neutral: number }): number {
    const scores = Object.values(similarities);
    const sortedScores = [...scores].sort((a, b) => b - a);
    
    // gap between top two scores (separation confidence)
    const separationGap = sortedScores[0] - sortedScores[1];
    
    // standard deviation (consistency confidence)
    // higher std dev means more confident classification
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // absolute confidence (how high is the max score)
    const absoluteConfidence = sortedScores[0];
    
    // normalize components to 0-1 range
    const normalizedSeparation = Math.min(1, separationGap * 5); // scale separation gap
    const normalizedConsistency = Math.min(1, stdDev * 3); // scale standard deviation  
    const normalizedAbsolute = absoluteConfidence; // already 0-1 from cosine similarity
    
    // combined confidence score w/ weights
    const separationWeight = 0.4;
    const consistencyWeight = 0.3;
    const absoluteWeight = 0.3;
    
    const confidence = (
      normalizedSeparation * separationWeight +
      normalizedConsistency * consistencyWeight +
      normalizedAbsolute * absoluteWeight
    );
    
    return Math.min(1, Math.max(0, confidence));
  }


  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }



  private async getEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await fetch('/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts })
    });

    if (!response.ok) {
      throw new Error(`Embeddings failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embeddings;
  }
}
