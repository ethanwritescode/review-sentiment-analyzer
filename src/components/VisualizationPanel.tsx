import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScatterPlot } from "@/components/ScatterPlot";
import { SentimentAnalysisResults } from "@/components/SentimentAnalysisResults";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type SentimentAnalysis = {
  totalReviews: number;
  sentimentCounts: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };
  sentimentPercentages: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };
  sentimentGroups: {
    Positive: Array<{ text: string; sentiment: string; confidence: number }>;
    Negative: Array<{ text: string; sentiment: string; confidence: number }>;
    Neutral: Array<{ text: string; sentiment: string; confidence: number }>;
  };
  overallRating: string;
  averageConfidence: number;
};

interface VisualizationPanelProps {
  points: Array<{ x: number; y: number; sentiment: string; text: string; confidence: number }>;
  sentimentAnalysis: SentimentAnalysis | null;
  showInsights: boolean;
  onExport: () => void;
  onToggleInsights: () => void;
}

export function VisualizationPanel({
  points,
  sentimentAnalysis,
  showInsights,
  onExport,
  onToggleInsights
}: VisualizationPanelProps) {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 400 : 500;
  return (
    <div className="flex-1 min-w-0">
      <div className="bg-white dark:bg-[#191919] rounded-lg border border-gray-200 dark:border-gray-700 h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                Visualization
              </h3>
              {points.length > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {points.length} points
                </Badge>
              )}
            </div>
            {points.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-7 px-3 text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Interactive scatter plot of your sentiment analysis results
          </p>
        </div>
        <div className="p-1">
          <div className={`w-full h-[${chartHeight}px] rounded-md overflow-hidden`}>
            <ScatterPlot
              points={points}
              width={800}
              height={chartHeight}
            />
          </div>

          {sentimentAnalysis && (
            <SentimentAnalysisResults
              sentimentAnalysis={sentimentAnalysis}
              showInsights={showInsights}
              onToggleInsights={onToggleInsights}
            />
          )}
        </div>
      </div>
    </div>
  );
}
