"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay, FaPause } from "react-icons/fa";

export default function Practice() {
  // State to track clicked tests and last visited questions
  const [testProgress, setTestProgress] = useState<{ [key: number]: number }>(
    {}
  );

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("practiceTestProgress");
    if (savedProgress) {
      setTestProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Function to update last visited question
  const handleClick = (testNumber: number) => {
    const lastQuestion = testProgress[testNumber] || 1; // Default to question 1
    localStorage.setItem(
      "practiceTestProgress",
      JSON.stringify({ ...testProgress, [testNumber]: lastQuestion })
    );
    setTestProgress((prev) => ({ ...prev, [testNumber]: lastQuestion }));
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
            <Link
              key={testNumber}
              href={`/citizenship-test/practice/${testNumber}/question/${lastQuestion}`}
              className="relative bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-col justify-between h-32"
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
