"use client";

import { useState, useEffect } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";

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
      localStorage.removeItem(`test-${selectedTest}-answers`);
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
      <div className="w-full sm:w-auto grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 gap-5">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((testNumber) => {
          const isStarted = testProgress[testNumber] !== undefined;

          return (
            <a
              key={testNumber}
              href={
                isStarted
                  ? `/citizenship-test/practice/${testNumber}/question/1`
                  : "#"
              }
              className="w-full sm:w-72 relative rounded-lg shadow-md border border-zinc-200 px-4 py-3 items-center space-y-1.5 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={(e) => {
                e.preventDefault();
                handleClick(testNumber);
              }}
            >
              {/* Top Section: 20 Questions and Status */}
              <div className="flex w-full justify-between">
                <p className="text-sm font-medium text-base-400">
                  20 QUESTIONS
                </p>
                <div className="flex items-center text-base-400 text-xs mr-1">
                  {isStarted ? (
                    <>
                      <p className="text-base-400">In progress</p>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full ml-1"></div>
                    </>
                  ) : (
                    <>
                      <p>Not started</p>
                      <div className="w-2 h-2 bg-gray-400 rounded-full ml-1"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Section: Practice Test Number and Icon */}
              <div className="flex items-center justify-between">
                <p className="text-base-900 text-xl font-semibold">
                  Practice Test {testNumber}
                </p>
                <button className="w-5 h-5 text-gray-700">
                  {isStarted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path d="M15 6.75a.75.75 0 0 0-.75.75V18a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H15ZM20.25 6.75a.75.75 0 0 0-.75.75V18c0 .414.336.75.75.75H21a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75h-.75ZM5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L5.055 7.061Z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </a>
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
