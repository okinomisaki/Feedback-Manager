"use client";

import { Sparkles } from "lucide-react";
import { FeedbackBuilder } from "../components/feedback-builder";

export default function FeedbackManager() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b-2 border-pink-200 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Feedback Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              GitHub課題フィードバック作成ツール
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <FeedbackBuilder />
      </main>
    </div>
  );
}
