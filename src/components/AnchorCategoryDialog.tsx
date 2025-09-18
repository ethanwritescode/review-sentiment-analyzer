import { useState, memo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { RotateCcw, Check, Edit } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnchorCategoryDialogProps {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: string;
  count: number;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onLoadDefaults: () => void;
}

interface EditorContentProps {
  className?: string;
  value: string;
  placeholder: string;
  isDesktop: boolean;
  onValueChange: (value: string) => void;
  onLoadDefaults: () => void;
}

const EditorContent = memo(function EditorContent({
  className,
  value,
  placeholder,
  isDesktop,
  onValueChange,
  onLoadDefaults
}: EditorContentProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <Textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          rows={isDesktop ? 14 : 10}
          className="border-0 bg-transparent resize-none text-sm p-0 focus-visible:ring-0 font-mono"
        />
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            {value.split('\n').filter(s => s.trim()).length} anchor{value.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''} defined
          </span>
          <span>One anchor per line</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadDefaults}
          className="h-7 px-3 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
});

export const AnchorCategoryDialog = memo(function AnchorCategoryDialog({
  type,
  title,
  icon: Icon,
  color,
  value,
  count,
  placeholder,
  disabled = false,
  onChange,
  onLoadDefaults
}: AnchorCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  // Sync local value with prop value when dialog opens
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  // Sync local value with parent when dialog closes
  useEffect(() => {
    if (!open && localValue !== value) {
      onChange(localValue);
    }
  }, [open, localValue, value, onChange]);

  const handleLoadDefaults = () => {
    onLoadDefaults();
    setLocalValue(value);
  };

  const TriggerButton = (
    <Button
      variant="ghost"
      className={`w-full h-auto p-3 justify-start hover:bg-white dark:hover:bg-[#191919] border border-gray-200 dark:border-gray-700 rounded-lg ${
        disabled ? 'opacity-60' : ''
      }`}
      disabled={disabled}
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {count} anchor{count !== 1 ? 's' : ''} • Click to edit
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {count}
          </Badge>
          <Edit className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </Button>
  );

  // Desktop: Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {TriggerButton}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              Edit {title}
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Define anchor phrases that represent {type} sentiment. Each line should be a complete phrase 
              that clearly expresses {type} sentiment patterns for accurate classification.
            </p>
          </DialogHeader>
          <EditorContent
            value={localValue}
            placeholder={placeholder}
            isDesktop={isDesktop}
            onValueChange={setLocalValue}
            onLoadDefaults={handleLoadDefaults}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {TriggerButton}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-3 text-lg">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            Edit {title}
          </DrawerTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Define anchor phrases for {type} sentiment classification.
          </p>
        </DrawerHeader>
        <EditorContent
          className="px-4"
          value={localValue}
          placeholder={placeholder}
          isDesktop={isDesktop}
          onValueChange={setLocalValue}
          onLoadDefaults={handleLoadDefaults}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
