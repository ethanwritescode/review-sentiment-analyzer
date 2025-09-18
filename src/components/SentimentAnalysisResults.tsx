import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Minus, Star, Eye } from "lucide-react";

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

interface SentimentAnalysisResultsProps {
  sentimentAnalysis: SentimentAnalysis;
  showInsights: boolean;
  onToggleInsights: () => void;
}

export function SentimentAnalysisResults({
  sentimentAnalysis,
  showInsights,
  onToggleInsights
}: SentimentAnalysisResultsProps) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            Sentiment Analysis Results
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInsights}
          className="h-6 px-2 text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          {showInsights ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-900 dark:text-green-100">Positive</span>
          </div>
          <div className="text-lg font-semibold text-green-900 dark:text-green-100">
            {sentimentAnalysis.sentimentPercentages.Positive}%
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">
            {sentimentAnalysis.sentimentCounts.Positive} reviews
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsDown className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-900 dark:text-red-100">Negative</span>
          </div>
          <div className="text-lg font-semibold text-red-900 dark:text-red-100">
            {sentimentAnalysis.sentimentPercentages.Negative}%
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">
            {sentimentAnalysis.sentimentCounts.Negative} reviews
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Minus className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Neutral</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {sentimentAnalysis.sentimentPercentages.Neutral}%
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            {sentimentAnalysis.sentimentCounts.Neutral} reviews
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-900 dark:text-blue-100">Overall Rating</span>
          </div>
          <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {sentimentAnalysis.overallRating}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            {sentimentAnalysis.totalReviews} total
          </div>
        </div>
      </div>

      {showInsights && (
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">Sentiment Breakdown</h5>

          {(['Positive', 'Negative', 'Neutral'] as const).map((sentiment) => {
            const group = sentimentAnalysis.sentimentGroups[sentiment];
            const icon = sentiment === 'Positive' ? ThumbsUp : sentiment === 'Negative' ? ThumbsDown : Minus;
            const IconComponent = icon;
            const colorClasses = {
              Positive: 'border-green-300 bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100',
              Negative: 'border-red-300 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100',
              Neutral: 'border-gray-300 bg-gray-50 dark:bg-gray-950/20 text-gray-900 dark:text-gray-100'
            };

            return (
              <div key={sentiment} className={`p-4 rounded-lg border ${colorClasses[sentiment]}`}>
                <div className="flex items-center gap-2 mb-3">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{sentiment} Reviews</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {group.length} reviews ({sentimentAnalysis.sentimentPercentages[sentiment]}%)
                  </Badge>
                </div>


                <div className="space-y-2">
                  <span className="text-xs font-medium opacity-75">Sample reviews:</span>
                  {group.slice(0, 2).map((review, idx) => (
                    <div key={idx} className="text-xs opacity-80 pl-3 border-l-2 border-current border-opacity-30">
                      <span>&quot;</span>{review.text.substring(0, 120)}{review.text.length > 120 ? '...' : ''}<span>&quot;</span>
                    </div>
                  ))}
                  {group.length > 2 && (
                    <div className="text-xs opacity-60">
                      +{group.length - 2} more {sentiment.toLowerCase()} reviews
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
