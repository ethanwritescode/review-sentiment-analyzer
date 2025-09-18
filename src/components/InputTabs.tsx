import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerReviewsInput } from "./CustomerReviewsInput";
import { SentimentAnchorsEditor } from "./SentimentAnchorsEditor";
import { FileText, Target } from "lucide-react";
import { type SentimentAnchors } from "@/config/sentimentAnchors";
import { motion, AnimatePresence } from "framer-motion";

interface InputTabsProps {
  input: string;
  onInputChange: (value: string) => void;
  itemCount: number;
  loading: boolean;
  pointsCount: number;
  onRun: () => void;
  onReset: () => void;
  
  customAnchors?: SentimentAnchors;
  onAnchorsChange?: (anchors: SentimentAnchors | undefined) => void;
}

export function InputTabs({
  input,
  onInputChange,
  itemCount,
  loading,
  pointsCount,
  onRun,
  onReset,
  customAnchors,
  onAnchorsChange
}: InputTabsProps) {
  const [activeTab, setActiveTab] = React.useState("reviews");

  const tabContentVariants = {
    hidden: { 
      opacity: 0, 
      y: 8
    },
    visible: { 
      opacity: 1, 
      y: 0
    },
    exit: { 
      opacity: 0, 
      y: -8
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="anchors" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Anchors</span>
          </TabsTrigger>
        </TabsList>
      </motion.div>
      
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <TabsContent value="reviews" className="mt-0">
                <CustomerReviewsInput
                  input={input}
                  onInputChange={onInputChange}
                  itemCount={itemCount}
                  loading={loading}
                  pointsCount={pointsCount}
                  onRun={onRun}
                  onReset={onReset}
                />
              </TabsContent>
            </motion.div>
          )}
          
          {activeTab === "anchors" && (
            <motion.div
              key="anchors"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <TabsContent value="anchors" className="mt-0">
                <SentimentAnchorsEditor
                  customAnchors={customAnchors}
                  onAnchorsChange={onAnchorsChange}
                  disabled={loading}
                />
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
