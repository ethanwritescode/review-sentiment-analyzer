## Review Sentiment Analyzer

A sentiment analysis tool that uses vector embeddings to analyze customer reviews with high accuracy and visualizes results in an interactive scatter plot.

## Features

- **Semantic Analysis**: Uses OpenAI's `text-embedding-3-large` model for accurate sentiment classification
- **Interactive Visualization**: Scatter plot with sentiment on X-axis, confidence score on Y-axis
- **Customizable Anchors**: Define your own sentiment anchors or use defaults
- **Mobile Responsive**: Clean, responsive design that works on all devices
- **Export Data**: Download analysis results as CSV for further processing
- **Smart Caching**: Intelligent anchor embedding caching for performance

## How It Works

1. **Input Reviews**: Enter customer reviews (one per line) or use the sample dataset
2. **Customize Anchors** (Optional): Define positive, negative, and neutral sentiment anchors
3. **Analysis**: The system generates embeddings and classifies sentiment using cosine similarity
4. **Visualization**: Results are plotted with sentiment/confidence score-based positioning
5. **Export Results**: Download CSV with analysis data

## Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, TypeScript
- **UI Components**: Shadcn/ui with Radix primitives
- **AI/ML**: OpenAI Embeddings API, sentiment classification
- **Visualization**: Recharts for interactive scatter plots
- **Architecture**: Modular, type-safe components with clean separation of concerns

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/ethanwritescode/review-sentiment-analyzer.git
cd review-sentiment-analyzer
```

### 2. Environment Configuration

Create `.env.local` in the root directory:

```env
OPENAI_API_KEY=sk-proj-1234567890
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open Application

Navigate to [http://localhost:3000](http://localhost:3000) and start analyzing sentiment!

## Usage

1. **Enter Reviews**: Paste customer reviews in the text area (one per line)
2. **Optional - Customize Anchors**: Switch to the "Anchors" tab to define custom sentiment anchors
3. **Analyze**: Click "Analyze Reviews" to process
4. **Explore Results**: 
   - View interactive scatter plot (hover for details)
   - Check sentiment statistics and sample reviews
   - Toggle insights panel for detailed breakdown
5. **Export**: Download CSV file with analysis data

## Architecture

The application follows a clean, modular architecture:

- **`/src/app`** - Next.js app router with API routes
- **`/src/components`** - Reusable UI components
- **`/src/lib`** - Core AI logic and utilities
- **`/src/config`** - Configuration and sample data

## Contributing

Contributions are welcome! Please feel free to submit a pull request with any improvements you'd like to see.

## License

MIT License - This project is open source and licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
