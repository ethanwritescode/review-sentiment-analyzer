"use client";

import { useMemo, useState } from "react";
import { InputTabs } from "@/components/InputTabs";
import { VisualizationPanel } from "@/components/VisualizationPanel";
import { EmbeddingSentimentService } from "@/lib/embeddingSentimentService";
import { getSampleReviewsText } from "@/config/sampleReviews";
import { type SentimentAnchors } from "@/config/sentimentAnchors";


export default function Home() {
  const [input, setInput] = useState(getSampleReviewsText());
  const [points, setPoints] = useState<{ x: number; y: number; sentiment: string; text: string; confidence: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [customAnchors, setCustomAnchors] = useState<SentimentAnchors | undefined>(undefined);
  const items = useMemo(() => input.split(/\n+/).map((s) => s.trim()).filter(Boolean), [input]);

  const sentimentAnalysis = useMemo(() => {
    if (!points.length) return null;

    const sentimentGroups = {
      Positive: points.filter(p => p.sentiment.toLowerCase() === 'positive'),
      Negative: points.filter(p => p.sentiment.toLowerCase() === 'negative'), 
      Neutral: points.filter(p => p.sentiment.toLowerCase() === 'neutral')
    };

    const sentimentCounts = {
      Positive: sentimentGroups.Positive.length,
      Negative: sentimentGroups.Negative.length,
      Neutral: sentimentGroups.Neutral.length
    };

    const sentimentPercentages = {
      Positive: Math.round((sentimentCounts.Positive / points.length) * 100),
      Negative: Math.round((sentimentCounts.Negative / points.length) * 100),
      Neutral: Math.round((sentimentCounts.Neutral / points.length) * 100)
    };


    return {
      totalReviews: points.length,
      sentimentCounts,
      sentimentPercentages,
      sentimentGroups,
      overallRating: sentimentPercentages.Positive > 60 ? 'Excellent' :
                     sentimentPercentages.Positive > 40 ? 'Good' :
                     sentimentPercentages.Negative > 40 ? 'Poor' : 'Mixed',
      averageConfidence: points.reduce((sum, p) => sum + p.confidence, 0) / points.length
    };
  }, [points]);


  async function handleRun() {
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const analysisResult = await EmbeddingSentimentService.performAnalysis(items, customAnchors);
      
      const pts = analysisResult.reviews.map((review) => ({
        x: review.coordinates.x,
        y: review.coordinates.y,
        sentiment: review.sentiment.sentiment.charAt(0).toUpperCase() + review.sentiment.sentiment.slice(1),
        text: review.text,
        confidence: review.sentiment.confidence
      }));

      setPoints(pts);
    } catch (e) {
      console.error('Sentiment analysis failed:', e);
      alert(`Analysis failed: ${e instanceof Error ? e.message : 'Unknown error'}. Check console for details.`);
    } finally {
        setLoading(false);
    }
  }

  function handleReset() {
    setPoints([]);
  }

  function handleExport() {
    if (points.length === 0) return;

    const headers = [
      "review_text", 
      "ai_sentiment", 
      "ai_confidence_score",
      "x_coordinate", 
      "y_coordinate"
    ];
    
    const rows = points.map(p => {
      return `"${p.text.replace(/"/g, '""')}","${p.sentiment}",${p.confidence.toFixed(3)},${p.x.toFixed(3)},${p.y.toFixed(3)}`;
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-powered-sentiment-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  }


  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <div className="max-w-6xl mx-auto">
        <div className="px-6 py-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Review Sentiment Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl">
            Analyze customer sentiment using vector embeddings. Enter reviews, customize sentiment anchors, and visualize patterns.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6 p-4 lg:p-6">
          <div className="w-full lg:flex-none lg:w-[380px] lg:max-w-full space-y-4">
            <InputTabs
              input={input}
              onInputChange={setInput}
              itemCount={items.length}
              loading={loading}
              pointsCount={points.length}
              onRun={handleRun}
              onReset={handleReset}
              customAnchors={customAnchors}
              onAnchorsChange={setCustomAnchors}
            />
          </div>

          <div className="w-full lg:flex-1 lg:min-w-0">
            <VisualizationPanel
                    points={points}
              sentimentAnalysis={sentimentAnalysis}
              showInsights={showInsights}
              onExport={handleExport}
              onToggleInsights={() => setShowInsights(!showInsights)}
            />
            </div>
          </div>
        </div>
      </div>
  );
}
