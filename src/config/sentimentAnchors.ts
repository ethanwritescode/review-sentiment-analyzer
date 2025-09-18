/**Sentiment anchor texts for classification*/

export const DEFAULT_SENTIMENT_ANCHORS = {
  positive: [
    "I absolutely love this product! It exceeded my expectations.",
    "Outstanding quality and fast shipping. Highly recommend!",
    "This is exactly what I needed. Perfect!",
    "Amazing customer service and great value for money.",
    "Best purchase I've made in a long time. Five stars!",
    "Fantastic product, works flawlessly. Very satisfied.",
    "Excellent quality, arrived quickly, perfect condition.",
    "This product is incredible! So happy with my purchase.",
    "Great experience overall. Will definitely buy again.",
    "Perfect! Exactly as described and works beautifully.",
    "Love it! Worth every penny and more.",
    "Exceptional quality. Couldn't be happier with this.",
    "Amazing! This product has changed my life for the better.",
    "Top-notch service and premium quality. Impressed!",
    "Brilliant! Everything I hoped for and more."
  ],
  
  negative: [
    "This product is terrible. Complete waste of money.",
    "Poor quality, broke after one week. Very disappointed.",
    "Worst purchase ever. Don't buy this!",
    "Cheap materials, doesn't work as advertised.",
    "Horrible customer service. Product arrived damaged.",
    "This is garbage. Save your money and buy something else.",
    "Completely useless. Nothing like the description.",
    "Poor design, uncomfortable to use. Regret buying this.",
    "Overpriced junk. Expected much better quality.",
    "Defective product. Stopped working immediately.",
    "Awful experience. Would not recommend to anyone.",
    "Terrible quality control. Product fell apart quickly.",
    "Disappointed and frustrated. This is not worth it.",
    "Poor craftsmanship. Feels cheap and flimsy.",
    "Waste of time and money. Very unsatisfied."
  ],
  
  neutral: [
    "The product works as expected. Nothing special.",
    "It's okay. Does what it's supposed to do.",
    "Average quality for the price point.",
    "Product arrived on time. Standard packaging.",
    "It's fine. Not great, not terrible.",
    "Does the job. Nothing more, nothing less.",
    "Acceptable quality. Meets basic requirements.",
    "Standard product. No complaints, no praise.",
    "It works. Pretty much what you'd expect.",
    "Decent enough. Gets the job done.",
    "Fair quality. About what I expected for the price.",
    "Functional but unremarkable. It's adequate.",
    "Basic product that serves its purpose.",
    "Neither impressed nor disappointed. It's okay.",
    "Reasonable quality. No major issues or surprises.",
    "Mixed feelings about this purchase. Some pros and cons.",
    "Has both positive and negative aspects. Balanced overall.",
    "Good points and bad points. Hard to say definitively.",
    "Some features work well, others could be improved.",
    "Decent value but room for improvement in some areas."
  ]
};

export type SentimentAnchors = {
  positive: string[];
  negative: string[];
  neutral: string[];
};
