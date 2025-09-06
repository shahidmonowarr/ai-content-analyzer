"use client";

import { AnalysisResults as ResultsType } from "@/types";
import SentimentMeter from "./SentimentMeter";
import TopicCloud from "./TopicCloud";

interface AnalysisResultsProps {
  results: ResultsType;
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Analysis Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Sentiment Analysis
          </h3>
          <SentimentMeter score={results.sentiment.score} />
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {results.sentiment.label} (
              {Math.round(results.sentiment.confidence * 100)}% confidence)
            </span>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Key Topics
          </h3>
          <TopicCloud topics={results.topics} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg prose max-w-none">
          {results.summary}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Understanding Questions
          </h3>
          <div className="space-y-4">
            {results.questions.map((item, index) => (
              <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Q: {item.question}</p>
                <p className="mt-2 text-gray-600">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Related Concepts
          </h3>
          <div className="space-y-4">
            {results.concepts.map((item, index) => (
              <div key={index} className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800">{item.concept}</h4>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
