import { AnalysisResults } from "@/types";

// Free Hugging Face API endpoints
const HUGGING_FACE_API = {
  SUMMARIZATION:
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
  SENTIMENT:
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
  TEXT_GENERATION:
    "https://api-inference.huggingface.co/models/google/flan-t5-base",
};

// Simple fallback functions for when Hugging Face is unavailable
const fallbackSummarize = (text: string): string => {
  const sentences = text.split(". ");
  if (sentences.length <= 3) return text;
  return sentences.slice(0, 3).join(". ") + ".";
};

const fallbackSentiment = (): {
  score: number;
  label: string;
  confidence: number;
} => {
  return { score: 0, label: "neutral", confidence: 0.7 };
};

const fallbackTopics = (): string[] => {
  return ["General", "Technology", "Information"];
};

const fallbackQuestions = (): { question: string; answer: string }[] => {
  return [
    {
      question: "What is the main idea?",
      answer: "The text discusses various topics.",
    },
    {
      question: "What details are provided?",
      answer: "The text provides general information.",
    },
  ];
};

const fallbackConcepts = (): { concept: string; description: string }[] => {
  return [
    {
      concept: "Information",
      description: "Data or knowledge provided or learned",
    },
    {
      concept: "Analysis",
      description: "Detailed examination of elements or structure",
    },
  ];
};

// Main analysis function
export async function analyzeContent(
  content: string
): Promise<AnalysisResults> {
  try {
    // Try to use Hugging Face APIs with fallbacks
    const [summary, sentiment, topics, questions, concepts] =
      await Promise.allSettled([
        getSummary(content),
        getSentiment(content),
        getTopics(content),
        getQuestions(content),
        getConcepts(content),
      ]);

    return {
      summary:
        summary.status === "fulfilled"
          ? summary.value
          : fallbackSummarize(content),
      sentiment:
        sentiment.status === "fulfilled"
          ? sentiment.value
          : fallbackSentiment(),
      topics: topics.status === "fulfilled" ? topics.value : fallbackTopics(),
      questions:
        questions.status === "fulfilled"
          ? questions.value
          : fallbackQuestions(),
      concepts:
        concepts.status === "fulfilled" ? concepts.value : fallbackConcepts(),
    };
  } catch (error) {
    console.error("Error in content analysis:", error);
    // Return fallback results if everything fails
    return {
      summary: fallbackSummarize(content),
      sentiment: fallbackSentiment(),
      topics: fallbackTopics(),
      questions: fallbackQuestions(),
      concepts: fallbackConcepts(),
    };
  }
}

// Individual analysis functions with fallbacks
async function getSummary(text: string): Promise<string> {
  try {
    // Try Hugging Face first
    const response = await fetch(HUGGING_FACE_API.SUMMARIZATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (response.ok) {
      const result = await response.json();
      return result[0]?.summary_text || fallbackSummarize(text);
    }

    throw new Error("Hugging Face API failed");
  } catch (error) {
    // Use fallback if API fails
    return fallbackSummarize(text);
  }
}

async function getSentiment(
  text: string
): Promise<{ score: number; label: string; confidence: number }> {
  try {
    // Simple sentiment analysis (free and local)
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "positive",
      "happy",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "negative",
      "sad",
      "angry",
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    let score = 0;
    let label = "neutral";

    if (total > 0) {
      score = (positiveCount - negativeCount) / total;
      label = score > 0.1 ? "positive" : score < -0.1 ? "negative" : "neutral";
    }

    return { score, label, confidence: Math.abs(score) };
  } catch (error) {
    return fallbackSentiment();
  }
}

async function getTopics(text: string): Promise<string[]> {
  try {
    // Simple topic extraction based on frequent nouns
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = new Set([
      "the",
      "and",
      "is",
      "in",
      "to",
      "of",
      "for",
      "with",
      "on",
      "at",
      "by",
    ]);

    // Count word frequencies (simple approach)
    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      if (word.length > 4 && !commonWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // Get top 3-5 words as topics
    const topics = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    return topics.length > 0 ? topics : fallbackTopics();
  } catch (error) {
    return fallbackTopics();
  }
}

async function getQuestions(
  text: string
): Promise<{ question: string; answer: string }[]> {
  try {
    // Simple question generation based on sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.length > 10);
    const questions = sentences.slice(0, 3).map((sentence) => {
      const words = sentence.trim().split(/\s+/);
      if (words.length < 5) {
        return {
          question: `What is mentioned about "${words[0]}"?`,
          answer: sentence,
        };
      }

      return {
        question: `What does the text say about "${words
          .slice(0, 3)
          .join(" ")}..."?`,
        answer: sentence,
      };
    });

    return questions.length > 0 ? questions : fallbackQuestions();
  } catch (error) {
    return fallbackQuestions();
  }
}

async function getConcepts(
  text: string
): Promise<{ concept: string; description: string }[]> {
  try {
    // Simple concept extraction
    const sentences = text.split(/[.!?]+/).filter((s) => s.length > 20);
    const concepts = sentences.slice(0, 3).map((sentence) => {
      const words = sentence.trim().split(/\s+/);
      const concept = words.slice(0, 2).join(" ");

      return {
        concept: concept.charAt(0).toUpperCase() + concept.slice(1),
        description:
          sentence.length > 100 ? sentence.substring(0, 100) + "..." : sentence,
      };
    });

    return concepts.length > 0 ? concepts : fallbackConcepts();
  } catch (error) {
    return fallbackConcepts();
  }
}

// Function to extract text from a URL
export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    // For security, we'll only allow HTTP/HTTPS URLs
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error("Invalid URL format");
    }

    const response = await fetch(
      `/api/extract-text?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Failed to extract text from URL");
    }

    const data = await response.json();
    return data.text || "No text content could be extracted from this URL.";
  } catch (error) {
    console.error("Error extracting text from URL:", error);
    return "Failed to extract text from the URL. Please check the URL and try again, or paste the content directly.";
  }
}
