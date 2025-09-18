import { EmbeddingSentimentAnalyzer } from './embeddingSentimentAnalyzer';
import { type SentimentAnchors } from '../config/sentimentAnchors';

export type EmbeddingSentimentResult = {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  method: 'embedding';
};

export type EmbeddingAnalysisResult = {
  reviews: Array<{
    text: string;
    index: number;
    sentiment: EmbeddingSentimentResult;
    coordinates: { x: number; y: number };
  }>;
};

export class EmbeddingSentimentService {
  private static embeddingAnalyzer = new EmbeddingSentimentAnalyzer();


  static async performAnalysis(texts: string[], customAnchors?: SentimentAnchors): Promise<EmbeddingAnalysisResult> {
    const analysisResult = await this.embeddingAnalyzer.analyzeSentiment(texts, customAnchors);
    
    const reviews = analysisResult.reviews.map(review => ({
      text: review.text,
      index: review.index,
      sentiment: {
        sentiment: review.sentiment.sentiment,
        confidence: review.sentiment.confidence,
        method: 'embedding' as const
      },
      coordinates: review.coordinates
    }));

    return {
      reviews
    };
  }

}
