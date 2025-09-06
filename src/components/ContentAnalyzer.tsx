"use client";

import { useState } from "react";
import { analyzeContent, extractTextFromUrl } from "@/lib/free-ai-service";
import AnalysisResults from "./AnalysisResults";
import { HistoryItem } from "@/types";

export default function ContentAnalyzer() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let content = input.trim();
    if (!content) return;

    setIsLoading(true);
    setError(null);

    try {
      // If URL tab is active and input looks like a URL, extract content
      if (activeTab === "url" && isUrl(content)) {
        content = await extractTextFromUrl(content);
        if (content.includes("Failed to extract")) {
          throw new Error(content);
        }
      }

      const analysis = await analyzeContent(content);
      setResults(analysis);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        timestamp: new Date(),
        content:
          activeTab === "url"
            ? input
            : content.length > 100
            ? content.substring(0, 100) + "..."
            : content,
        analysis,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10 items

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "analysisHistory",
          JSON.stringify([newHistoryItem, ...history.slice(0, 9)])
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze content. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if string is a URL
  const isUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Load history from localStorage on component mount
  useState(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("analysisHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Free AI Content Analyzer
          </h1>
          <p className="text-gray-600">
            Advanced content analysis using free AI services
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              {/* Tab selector */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  type="button"
                  className={`py-2 px-4 font-medium ${
                    activeTab === "text"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("text")}
                >
                  Text Input
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 font-medium ${
                    activeTab === "url"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("url")}
                >
                  URL Analysis
                </button>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {activeTab === "text"
                    ? "Enter text to analyze"
                    : "Enter URL to analyze"}
                </label>
                {activeTab === "text" ? (
                  <textarea
                    id="content"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste article, blog post, or any text content here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                ) : (
                  <input
                    type="text"
                    id="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/article"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {activeTab === "text" && input.length > 0
                    ? `${input.length} characters`
                    : ""}
                  {activeTab === "url" && input.length > 0
                    ? "URL detected"
                    : ""}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Content"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </form>

            {results && <AnalysisResults results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
}
