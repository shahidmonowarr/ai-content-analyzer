import { AnalysisResults } from '@/types';

// Simple fallback functions
const fallbackSummarize = (text: string): string => {
  const sentences = text.split('. ');
  if (sentences.length <= 3) return text;
  return sentences.slice(0, 3).join('. ') + '.';
};

const fallbackSentiment = (): { score: number; label: string; confidence: number } => {
  return { score: 0, label: 'neutral', confidence: 0.7 };
};

const fallbackTopics = (): string[] => {
  return ['General', 'Technology', 'Information'];
};

// Main analysis function
export async function analyzeContent(content: string): Promise<AnalysisResults> {
  return {
    summary: fallbackSummarize(content),
    sentiment: fallbackSentiment(),
    topics: fallbackTopics(),
    questions: [{ question: 'What is the main idea?', answer: 'The text discusses various topics.' }],
    concepts: [{ concept: 'Information', description: 'Data or knowledge provided or learned' }]
  };
}