"use client";

import { useState } from "react";
import { analyzeContent } from "@/lib/free-ai-service";

export default function ContentAnalyzer() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const analysis = await analyzeContent(input);
      setResults(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          AI Content Analyzer
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <textarea
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Paste your content here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Content"}
          </button>
        </form>

        {results && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <p className="mb-4">{results.summary}</p>
            <p>Sentiment: {results.sentiment.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
