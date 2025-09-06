"use client";

import { HistoryItem } from "@/types";
import { Clock, Trash2 } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryItem[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const clearHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("analysisHistory");
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          History
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-red-500 hover:text-red-700 flex items-center text-sm"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No analysis history yet
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
            >
              <p className="text-sm text-gray-700 mb-1">{item.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <div className="mt-2 flex">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.analysis.sentiment.score > 0.3
                      ? "bg-green-100 text-green-800"
                      : item.analysis.sentiment.score < -0.3
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.analysis.sentiment.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
