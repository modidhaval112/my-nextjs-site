"use client";

// pages/citizenship-test/practice/[testNumber]/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestionsForTest } from "@/utils/getQuestions";

// Define types for the props
interface PracticeTestPageProps {
  params: { testNumber: string };
}

const PracticeTestPage = ({ params }: PracticeTestPageProps) => {
  const { testNumber } = params;
  const testNumberInt = parseInt(testNumber, 10);

  // Fetch questions dynamically based on testNumber
  const questions = getQuestionsForTest(testNumberInt);
  const [showAlert, setShowAlert] = useState(false);
  const [lastQuestionNumber, setLastQuestionNumber] = useState(1);

  // Check if the test is in progress on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test-${testNumberInt}-answers`);
    const savedTime = localStorage.getItem(`test-${testNumberInt}-time`);

    if (savedAnswers || savedTime) {
      setShowAlert(true);
      const answers = savedAnswers ? JSON.parse(savedAnswers) : {};
      const lastAnsweredQuestion = Math.max(
        ...Object.keys(answers).map((key) => parseInt(key, 10))
      );
      setLastQuestionNumber(lastAnsweredQuestion || 1);
    }
  }, [testNumberInt]);

  const handleResume = () => {
    setShowAlert(false);
    window.location.href = `/citizenship-test/practice/${testNumberInt}/question/${lastQuestionNumber}`;
  };

  const handleStartOver = () => {
    localStorage.removeItem(`test-${testNumberInt}-answers`);
    localStorage.removeItem(`test-${testNumberInt}-time`);
    setShowAlert(false);
    window.location.href = `/citizenship-test/practice/${testNumberInt}/question/1`;
  };

  return (
    <div>
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

      <h1 className="text-2xl font-bold mb-4">Practice Test {testNumberInt}</h1>
      <ul className="space-y-2">
        {questions.map((q, index) => (
          <li key={q.id} className="border p-4 rounded-md">
            <Link
              href={`/citizenship-test/practice/${testNumberInt}/question/${
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
};

export default PracticeTestPage;
