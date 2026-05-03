"use client";

import { useState } from "react";
import { ThumbsUp, Send } from "lucide-react";

interface Question {
  id: string;
  content: string;
  author: string | null;
  votes: number;
  createdAt: string;
}

interface QuestionListProps {
  questions: Question[];
  sessionId: string;
  isLive: boolean;
  onQuestionAdded: () => void;
}

export default function QuestionList({ questions, sessionId, isLive, onQuestionAdded }: QuestionListProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [author, setAuthor] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newQuestion,
          author: isAnonymous ? null : author,
        }),
      });
      
      if (res.ok) {
        setNewQuestion("");
        setAuthor("");
        onQuestionAdded();
      }
    } catch (error) {
      console.error("Error posting question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      await fetch(`/api/sessions/${sessionId}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });
      onQuestionAdded();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  return (
    <div className="space-y-6">
      {isLive && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Poser une question</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Votre question..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  Poser anonymement
                </label>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Votre nom"
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">
          Questions ({questions.length})
        </h4>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-gray-900">{question.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>Par {question.author || "Anonyme"}</span>
                    <span>•</span>
                    <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpvote(question.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold">{question.votes}</span>
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucune question pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}
