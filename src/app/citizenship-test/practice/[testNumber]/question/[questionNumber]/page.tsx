"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getQuestionsForTest } from "@/utils/getQuestions";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuestionPage({
  params,
}: {
  params: Promise<{ testNumber: string; questionNumber: string }>;
}) {
  const resolvedParams = use(params);
  const testNumber = parseInt(resolvedParams.testNumber, 10);
  const questionNumber = parseInt(resolvedParams.questionNumber, 10);
  const router = useRouter();

  const questions = getQuestionsForTest(testNumber);

  const [answers, setAnswers] = useState<{ [key: number]: string | null }>(
    () => {
      const savedAnswers = localStorage.getItem(`test-${testNumber}-answers`);
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    }
  );

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`test-${testNumber}-time`);
    return savedTime ? parseInt(savedTime, 10) : 45 * 60; // 45 minutes in seconds
  });

  const [showWarning, setShowWarning] = useState(false); // State to show warning

  useEffect(() => {
    localStorage.setItem(`test-${testNumber}-answers`, JSON.stringify(answers));
  }, [answers, testNumber]);

  useEffect(() => {
    localStorage.setItem(`test-${testNumber}-time`, timeLeft.toString());
  }, [timeLeft, testNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  if (questionNumber < 1 || questionNumber > questions.length) {
    return <h1 className="text-red-500 p-6">Question Not Found</h1>;
  }

  const question = questions[questionNumber - 1];

  const handleAnswerSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: option }));
  };

  const handleNavigation = (next: boolean) => {
    const nextQuestion = next ? questionNumber + 1 : questionNumber - 1;
    router.push(
      `/citizenship-test/practice/${testNumber}/question/${nextQuestion}`
    );
  };

  const handleSubmit = () => {
    const allAnswered = Object.keys(answers).length === 20;
    if (!allAnswered) {
      setShowWarning(true); // Show warning if not all questions are answered
      return;
    }

    setTimeLeft(45 * 60);

    const correctAnswersCount = Object.keys(answers).filter(
      (key) => answers[parseInt(key)] === questions[parseInt(key) - 1].answer
    ).length;

    localStorage.setItem(
      `test-${testNumber}-submitted-answers`,
      JSON.stringify(answers)
    );

    router.push(
      `/citizenship-test/practice/${testNumber}/result?score=${correctAnswersCount}`
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressClick = (questionNum: number) => {
    router.push(
      `/citizenship-test/practice/${testNumber}/question/${questionNum}`
    );
  };

  const allAnswered = Object.keys(answers).length === 20; // Check if all questions are answered

  return (
    <div className="p-6 flex gap-6">
      <div className="w-3/4">
        <div className="mt-6">
          <h1 className="text-lg font-bold">{question.question}</h1>
          <ul className="mt-4 space-y-2">
            {question.options.map((option, index) => {
              const isCorrect = option === question.answer;
              const isSelected = answers[questionNumber] === option;

              let backgroundColor = "bg-white";
              if (isSelected) {
                backgroundColor = isCorrect ? "bg-green-300" : "bg-red-300";
              } else if (answers[questionNumber] && isCorrect) {
                backgroundColor = "bg-green-300";
              }

              return (
                <li
                  key={index}
                  className={`p-2 border rounded-md cursor-pointer ${backgroundColor}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Warning Message */}
        {showWarning && (
          <div className="mt-4 text-red-500">
            Warning: You have to answer all questions to finish the test.
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            disabled={questionNumber === 1}
            onClick={() => handleNavigation(false)}
          >
            Prev
          </button>

          {questionNumber === 20 ? (
            <button
              className={`px-4 py-2 ${
                allAnswered ? "bg-green-500" : "bg-gray-400"
              } text-white rounded-md`}
              onClick={handleSubmit}
              disabled={!allAnswered} // Disable submit button if not all questions are answered
            >
              Submit
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handleNavigation(true)}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="w-1/4 flex flex-col items-center">
        <h2 className="font-bold text-lg">Practice Test {testNumber}</h2>
        <div className="text-gray-600 mb-4">
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 20 }).map((_, index) => {
            const isAnswered = answers[index + 1] !== undefined;
            const isCorrect =
              isAnswered && answers[index + 1] === questions[index].answer;
            return (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center border rounded-md cursor-pointer ${
                  index + 1 === questionNumber
                    ? "border-2 border-blue-500" // Highlight current question
                    : ""
                } ${
                  isAnswered
                    ? isCorrect
                      ? "bg-green-400"
                      : "bg-red-400"
                    : "bg-gray-300"
                }`}
                onClick={() => handleProgressClick(index + 1)} // Navigate to the clicked question
              >
                {isAnswered ? (
                  isCorrect ? (
                    <FaCheck color="white" />
                  ) : (
                    <FaTimes color="white" />
                  )
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
