import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Sparkles,
  Target
} from "lucide-react";
import { DEFAULT_SENTIMENT_ANCHORS, type SentimentAnchors } from "@/config/sentimentAnchors";
import { AnchorCategoryDialog } from "./AnchorCategoryDialog";

interface SentimentAnchorsEditorProps {
  customAnchors?: SentimentAnchors;
  onAnchorsChange?: (anchors: SentimentAnchors | undefined) => void;
  disabled?: boolean;
}

export function SentimentAnchorsEditor({ 
  customAnchors, 
  onAnchorsChange, 
  disabled = false 
}: SentimentAnchorsEditorProps) {
  const [useCustomAnchors, setUseCustomAnchors] = useState(!!customAnchors);
  const [anchorInputs, setAnchorInputs] = useState({
    positive: customAnchors?.positive.join('\n') || DEFAULT_SENTIMENT_ANCHORS.positive.join('\n'),
    negative: customAnchors?.negative.join('\n') || DEFAULT_SENTIMENT_ANCHORS.negative.join('\n'),
    neutral: customAnchors?.neutral.join('\n') || DEFAULT_SENTIMENT_ANCHORS.neutral.join('\n')
  });

  const handleAnchorChange = useCallback((type: keyof typeof anchorInputs, value: string) => {
    const newInputs = { ...anchorInputs, [type]: value };
    setAnchorInputs(newInputs);
  }, [anchorInputs]);

  // Debounced effect to call onAnchorsChange after user stops typing
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (useCustomAnchors && onAnchorsChange) {
      timeoutRef.current = setTimeout(() => {
        const anchors = {
          positive: anchorInputs.positive.split('\n').map(s => s.trim()).filter(Boolean),
          negative: anchorInputs.negative.split('\n').map(s => s.trim()).filter(Boolean),
          neutral: anchorInputs.neutral.split('\n').map(s => s.trim()).filter(Boolean)
        };
        onAnchorsChange(anchors);
      }, 500); // 500ms delay
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [anchorInputs, useCustomAnchors, onAnchorsChange]);

  // Memoized handlers for each anchor type to prevent re-renders
  const handlePositiveChange = useCallback((value: string) => {
    handleAnchorChange('positive', value);
  }, [handleAnchorChange]);

  const handleNegativeChange = useCallback((value: string) => {
    handleAnchorChange('negative', value);
  }, [handleAnchorChange]);

  const handleNeutralChange = useCallback((value: string) => {
    handleAnchorChange('neutral', value);
  }, [handleAnchorChange]);

  const handlePositiveLoadDefaults = useCallback(() => {
    handleAnchorChange('positive', DEFAULT_SENTIMENT_ANCHORS.positive.join('\n'));
  }, [handleAnchorChange]);

  const handleNegativeLoadDefaults = useCallback(() => {
    handleAnchorChange('negative', DEFAULT_SENTIMENT_ANCHORS.negative.join('\n'));
  }, [handleAnchorChange]);

  const handleNeutralLoadDefaults = useCallback(() => {
    handleAnchorChange('neutral', DEFAULT_SENTIMENT_ANCHORS.neutral.join('\n'));
  }, [handleAnchorChange]);

  const handleToggleCustomAnchors = useCallback((enabled: boolean) => {
    setUseCustomAnchors(enabled);
    if (onAnchorsChange) {
      if (enabled) {
        const anchors = {
          positive: anchorInputs.positive.split('\n').map(s => s.trim()).filter(Boolean),
          negative: anchorInputs.negative.split('\n').map(s => s.trim()).filter(Boolean),
          neutral: anchorInputs.neutral.split('\n').map(s => s.trim()).filter(Boolean)
        };
        onAnchorsChange(anchors);
      } else {
        onAnchorsChange(undefined);
      }
    }
  }, [anchorInputs, onAnchorsChange]);

  const loadDefaultAnchors = () => {
    setAnchorInputs({
      positive: DEFAULT_SENTIMENT_ANCHORS.positive.join('\n'),
      negative: DEFAULT_SENTIMENT_ANCHORS.negative.join('\n'),
      neutral: DEFAULT_SENTIMENT_ANCHORS.neutral.join('\n')
    });
  };

  const counts = useMemo(() => {
    return {
      positive: anchorInputs.positive.split('\n').filter(s => s.trim()).length,
      negative: anchorInputs.negative.split('\n').filter(s => s.trim()).length,
      neutral: anchorInputs.neutral.split('\n').filter(s => s.trim()).length
    };
  }, [anchorInputs]);
  
  const hasValidAnchors = useMemo(() => {
    return counts.positive > 0 && counts.negative > 0 && counts.neutral > 0;
  }, [counts]);

  return (
    <div className="bg-gray-50 dark:bg-[#202020] rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            Sentiment Classification
          </h3>
          <Badge variant="outline" className="ml-auto text-xs px-2 py-0.5">
            {useCustomAnchors ? 'Custom' : 'Default'} anchors
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {useCustomAnchors 
            ? 'Configure custom anchor phrases to define sentiment patterns'
            : 'Using sophisticated default anchors for accurate sentiment detection'
          }
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#191919] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
              Custom Anchor Mode
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Define your own sentiment classification patterns
            </div>
          </div>
          <Switch
            checked={useCustomAnchors}
            onCheckedChange={handleToggleCustomAnchors}
            disabled={disabled}
            className="ml-4"
          />
        </div>

        <div className="space-y-2">
          <AnchorCategoryDialog
            type="positive"
            title="Positive Anchors"
            icon={ThumbsUp}
            color="bg-green-500"
            value={anchorInputs.positive}
            count={counts.positive}
            placeholder="This is a positive review expressing clear satisfaction.&#10;The customer is happy and recommends the product.&#10;The reviewer praises the quality and experience..."
            disabled={!useCustomAnchors || disabled}
            onChange={handlePositiveChange}
            onLoadDefaults={handlePositiveLoadDefaults}
          />
          
          <AnchorCategoryDialog
            type="negative"
            title="Negative Anchors"
            icon={ThumbsDown}
            color="bg-red-500"
            value={anchorInputs.negative}
            count={counts.negative}
            placeholder="This is a negative review expressing dissatisfaction.&#10;The customer is unhappy and frustrated.&#10;The reviewer complains about poor quality..."
            disabled={!useCustomAnchors || disabled}
            onChange={handleNegativeChange}
            onLoadDefaults={handleNegativeLoadDefaults}
          />
          
          <AnchorCategoryDialog
            type="neutral"
            title="Neutral Anchors"
            icon={Minus}
            color="bg-gray-500"
            value={anchorInputs.neutral}
            count={counts.neutral}
            placeholder="This is a neutral review with no strong opinion.&#10;The sentiment is mixed and balanced.&#10;The review shares facts without emotion..."
            disabled={!useCustomAnchors || disabled}
            onChange={handleNeutralChange}
            onLoadDefaults={handleNeutralLoadDefaults}
          />
        </div>

        {useCustomAnchors && (
          <div className="pt-2 space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDefaultAnchors}
              className="w-full h-8 text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={disabled}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Load Default Anchors
            </Button>
            
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${
              hasValidAnchors 
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300'
                : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300'
            }`}>
              {hasValidAnchors ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    Ready with {counts.positive + counts.negative + counts.neutral} custom anchors
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    Add anchors to each category to enable analysis
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
