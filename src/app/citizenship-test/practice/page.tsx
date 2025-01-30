"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay, FaPause } from "react-icons/fa";

export default function Practice() {
  // State to track clicked tests and last visited questions
  const [testProgress, setTestProgress] = useState<{ [key: number]: number }>(
    {}
  );
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [lastQuestion, setLastQuestion] = useState<number>(1);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("practiceTestProgress");
    if (savedProgress) {
      setTestProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Function to handle test click
  const handleClick = (testNumber: number) => {
    const isStarted = testProgress[testNumber] !== undefined;

    if (isStarted) {
      // If the test is in progress, show the alert and set the last visited question
      setSelectedTest(testNumber);
      setLastQuestion(testProgress[testNumber]); // Set the last visited question
      setShowAlert(true);
    } else {
      // If the test is not started, proceed to the first question
      localStorage.setItem(
        "practiceTestProgress",
        JSON.stringify({ ...testProgress, [testNumber]: 1 })
      );
      setTestProgress((prev) => ({ ...prev, [testNumber]: 1 }));
    }
  };

  // Function to handle "Resume" action
  const handleResume = () => {
    if (selectedTest !== null) {
      setShowAlert(false);
      // Redirect to the last visited question
      window.location.href = `/citizenship-test/practice/${selectedTest}/question/${lastQuestion}`;
    }
  };

  // Function to handle "Start Over" action
  const handleStartOver = () => {
    if (selectedTest !== null) {
      // Reset progress for the selected test
      const updatedProgress = { ...testProgress, [selectedTest]: 1 };
      localStorage.setItem(
        "practiceTestProgress",
        JSON.stringify(updatedProgress)
      );
      setTestProgress(updatedProgress);

      // Reset the timer to 45 minutes (2700 seconds)
      localStorage.setItem(`test-${selectedTest}-time`, "2700");

      // Redirect to the first question
      setShowAlert(false);
      window.location.href = `/citizenship-test/practice/${selectedTest}/question/1`;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Practice Tests</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((testNumber) => {
          const lastQuestion = testProgress[testNumber] || 1;
          const isStarted = testProgress[testNumber] !== undefined;

          return (
            <div
              key={testNumber}
              className="relative bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-col justify-between h-32 cursor-pointer"
              onClick={() => handleClick(testNumber)}
            >
              {/* Top Left Corner: 20 Questions */}
              <div className="absolute top-2 left-2 text-gray-600 text-sm font-medium">
                20 Questions
              </div>

              {/* Bottom Left Corner: Practice Test Number */}
              <div className="absolute bottom-2 left-2 font-semibold">
                Practice Test {testNumber}
              </div>

              {/* Top Right Corner: Status */}
              <div className="absolute top-2 right-2 text-sm font-medium">
                {isStarted ? (
                  <span className="text-green-600">In Progress</span>
                ) : (
                  <span className="text-gray-600">Not Started</span>
                )}
              </div>

              {/* Bottom Right Corner: Play & Pause Icon */}
              <div className="absolute bottom-2 right-2 text-gray-700">
                {isStarted ? (
                  <div className="flex items-center space-x-2">
                    <FaPlay />
                    <FaPause />
                  </div>
                ) : (
                  <FaPlay />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Modal */}
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
    </div>
  );
}
