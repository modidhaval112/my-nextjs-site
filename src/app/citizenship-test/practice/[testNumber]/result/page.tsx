"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getQuestionsForTest } from "@/utils/getQuestions";
import { Star } from "lucide-react";

type AnswersType = { [key: number]: string };

export default function ResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const testNumber = parseInt(params.testNumber as string, 10);

  const [questions, setQuestions] = useState<
    { id: number; question: string; answer: string; options: string[] }[]
  >([]);
  const [answers, setAnswers] = useState<AnswersType>({});
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [starredQuestions, setStarredQuestions] = useState<number[]>([]);
  const score = searchParams.get("score");

  useEffect(() => {
    const storedAnswers = localStorage.getItem(
      `test-${testNumber}-submitted-answers`
    );
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers) as AnswersType);
    }

    const savedTime = localStorage.getItem(`test-${testNumber}-time`);
    if (savedTime) {
      const totalTime = 45 * 60 - parseInt(savedTime, 10);
      setTimeTaken(totalTime);
    }

    const savedStarred = localStorage.getItem("starred-questions");
    if (savedStarred) {
      setStarredQuestions(JSON.parse(savedStarred) as number[]);
    }

    const questions = getQuestionsForTest(testNumber);
    setQuestions(questions);
  }, [testNumber]);

  useEffect(() => {
    if (starredQuestions.length > 0) {
      localStorage.setItem(
        "starred-questions",
        JSON.stringify(starredQuestions)
      );
    }
  }, [starredQuestions]);

  const isPassed = parseInt(score || "0", 10) >= 15;
  const correctAnswersCount = parseInt(score || "0", 10);

  const toggleStar = (questionId: number) => {
    setStarredQuestions((prevStarred) => {
      const newStarredQuestions = prevStarred.includes(questionId)
        ? prevStarred.filter((id) => id !== questionId)
        : [...prevStarred, questionId];
      return newStarredQuestions;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium">Practice Test {testNumber}</h1>
        <h2 className="text-base-950 font-medium text-xl mt-2">
          Test Result: {isPassed ? "PASS" : "FAIL"}
        </h2>
        <p className="text-base-700 font-normal text-sm text-center">
          You need 15 correct answers in 45 minutes to pass the test.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-8 mb-8">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
            isPassed ? "border-green-500" : "border-red-500"
          }`}
        >
          <span className="text-sm font-bold">{correctAnswersCount}/20</span>
        </div>
        <div className="h-16 w-px bg-gray-300"></div>

        <div className="text-center">
          <p>Time Consumed</p>
          <p>{formatTime(timeTaken)}</p>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        {questions.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {questions.map((q, index) => {
              const userAnswer = answers[index + 1];
              const isCorrect = answers[index + 1] === q.answer;
              const isStarred = starredQuestions.includes(q.id);

              return (
                <div
                  key={q.id}
                  className={`flex flex-col p-3 rounded-md max-w-xl w-full h-full ${
                    isCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base-500 text-sm">
                      QUESTION {index + 1} OF 20
                    </p>
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleStar(q.id)}
                    >
                      {isStarred ? (
                        <Star className="text-yellow-500" />
                      ) : (
                        <Star className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-base-950 font-medium text-lg mt-2">
                    {q.question}
                  </p>

                  <div className="flex flex-col space-y-1 w-full mt-2">
                    {q.options.map((option, i) => {
                      const isUserSelected = userAnswer === option;
                      const isRightAnswer = option === q.answer;
                      let bgColor = "";
                      const textColor = "text-base-950";

                      if (isUserSelected) {
                        bgColor = isRightAnswer
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white";
                      } else if (isRightAnswer) {
                        bgColor = "bg-green-600 text-white";
                      }

                      return (
                        <div
                          key={i}
                          className={`rounded-md px-2 py-1 ${bgColor} ${textColor}`}
                        >
                          <p className="font-light">{option}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading questions...</p>
        )}
      </div>
    </div>
  );
}
