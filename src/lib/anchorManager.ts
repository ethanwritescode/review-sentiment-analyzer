import { DEFAULT_SENTIMENT_ANCHORS, type SentimentAnchors } from '../config/sentimentAnchors';

export type AnchorEmbeddings = {
  positive: number[][];
  negative: number[][];
  neutral: number[][];
};

export class AnchorManager {
  private cachedEmbeddings: Map<string, AnchorEmbeddings> = new Map();


  async getAnchorEmbeddings(anchors: SentimentAnchors = DEFAULT_SENTIMENT_ANCHORS): Promise<AnchorEmbeddings> {
    const cacheKey = this.createCacheKey(anchors);
    
    if (this.cachedEmbeddings.has(cacheKey)) {
      return this.cachedEmbeddings.get(cacheKey)!;
    }
    
    const allAnchors = [
      ...anchors.positive,
      ...anchors.negative,
      ...anchors.neutral
    ];

    const embeddings = await this.getEmbeddings(allAnchors);
    
    const anchorEmbeddings: AnchorEmbeddings = {
      positive: embeddings.slice(0, anchors.positive.length),
      negative: embeddings.slice(anchors.positive.length, anchors.positive.length + anchors.negative.length),
      neutral: embeddings.slice(anchors.positive.length + anchors.negative.length)
    };

    this.cachedEmbeddings.set(cacheKey, anchorEmbeddings);
    
    return anchorEmbeddings;
  }

  
  private createCacheKey(anchors: SentimentAnchors): string {
    const combined = [
      ...anchors.positive,
      ...anchors.negative,
      ...anchors.neutral
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }


  private async getEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await fetch('/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        texts,
        model: 'text-embedding-3-large'
      })
    });

    if (!response.ok) {
      throw new Error(`Embeddings failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embeddings;
  }


}
