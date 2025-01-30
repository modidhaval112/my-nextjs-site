"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestionsForTest } from "@/utils/getQuestions";

export default function PracticeTestPage({
  params,
}: {
  params: { testNumber: string };
}) {
  const testNumber = parseInt(params.testNumber, 10);
  const questions = getQuestionsForTest(testNumber);
  const [showAlert, setShowAlert] = useState(false);
  const [lastQuestionNumber, setLastQuestionNumber] = useState(1);

  // Check if the test is in progress on component mount
  useEffect(() => {
    console.log(
      `Checking localStorage for test-${testNumber}-answers and test-${testNumber}-time`
    );

    const savedAnswers = localStorage.getItem(`test-${testNumber}-answers`);
    const savedTime = localStorage.getItem(`test-${testNumber}-time`);

    console.log("Saved Answers:", savedAnswers);
    console.log("Saved Time:", savedTime);

    if (savedAnswers || savedTime) {
      // Test is in progress, show alert
      setShowAlert(true);

      // Find the last answered question
      const answers = savedAnswers ? JSON.parse(savedAnswers) : {};
      const lastAnsweredQuestion = Math.max(
        ...Object.keys(answers).map((key) => parseInt(key, 10))
      );
      setLastQuestionNumber(lastAnsweredQuestion || 1);

      console.log("Last Answered Question:", lastAnsweredQuestion);
    } else {
      console.log("No saved progress found. Starting fresh.");
    }
  }, [testNumber]);

  // Handle "Resume" button click
  const handleResume = () => {
    setShowAlert(false);
    // Navigate to the last answered question
    window.location.href = `/citizenship-test/practice/${testNumber}/question/${lastQuestionNumber}`;
  };

  // Handle "Start Over" button click
  const handleStartOver = () => {
    // Clear saved progress and timer
    localStorage.removeItem(`test-${testNumber}-answers`);
    localStorage.removeItem(`test-${testNumber}-time`);
    setShowAlert(false);
    // Navigate to the first question
    window.location.href = `/citizenship-test/practice/${testNumber}/question/1`;
  };

  return (
    <div>
      {/* Alert Box */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Test In Progress</h2>
            <p className="mb-4">Would you like to resume or start over?</p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleResume}
              >
                Resume
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleStartOver}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Practice Test {testNumber}</h1>
      <ul className="space-y-2">
        {questions.map((q, index) => (
          <li key={q.id} className="border p-4 rounded-md">
            <Link
              href={`/citizenship-test/practice/${testNumber}/question/${
                index + 1
              }`}
            >
              {q.question}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
