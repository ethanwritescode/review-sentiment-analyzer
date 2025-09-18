import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Play, RotateCcw } from "lucide-react";

interface CustomerReviewsInputProps {
  input: string;
  onInputChange: (value: string) => void;
  itemCount: number;
  loading: boolean;
  pointsCount: number;
  onRun: () => void;
  onReset: () => void;
}

export function CustomerReviewsInput({ 
  input, 
  onInputChange, 
  itemCount, 
  loading, 
  pointsCount, 
  onRun, 
  onReset
}: CustomerReviewsInputProps) {
  return (
    <div className="bg-gray-50 dark:bg-[#202020] rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            Customer Reviews
          </h3>
          <Badge variant="outline" className="ml-auto text-xs px-2 py-0.5">
            {itemCount} items
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter customer reviews, one per line (will be automatically categorized by sentiment)
        </p>
      </div>
      <div className="p-4">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          rows={8}
          placeholder="I love the new mobile app interface, it's so intuitive\nThe checkout process is too complicated and frustrating\nCustomer service was incredibly helpful and patient\n..."
          className="border-0 bg-transparent resize-none text-sm p-0 focus-visible:ring-0 placeholder:text-gray-400"
        />
      </div>


      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Button
            onClick={onRun}
            disabled={loading || itemCount === 0}
            className="flex-1 h-8 text-sm bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white text-white shadow-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5" />
                Analyze Reviews
              </div>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading || pointsCount === 0}
            className="h-8 px-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
