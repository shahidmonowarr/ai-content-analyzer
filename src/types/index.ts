export interface HistoryItem {
  id: number;
  timestamp: Date;
  content: string;
  analysis: AnalysisResults;
}

export interface AnalysisResults {
  summary: string;
  sentiment: { score: number; label: string; confidence: number };
  topics: string[];
  questions: { question: string; answer: string }[];
  concepts: { concept: string; description: string }[];
}
