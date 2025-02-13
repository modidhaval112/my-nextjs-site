"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getQuestionsForTest } from "@/utils/getQuestions";
import { Star, StarOff } from "lucide-react"; // Importing star icons from lucide-react

type AnswersType = { [key: number]: string };

// Define the structure of a question object
type QuestionType = {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");

  const [questions, setQuestions] = useState<QuestionType[]>([]); // Correct type for questions
  const [answers, setAnswers] = useState<AnswersType>({});
  const [starredQuestions, setStarredQuestions] = useState<number[]>([]);
  const [wronglyAnsweredQuestions, setWronglyAnsweredQuestions] = useState<
    number[]
  >([]);
  const [tab, setTab] = useState("review");

  useEffect(() => {
    const storedAnswers = localStorage.getItem("test-answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers) as AnswersType);
    }

    const storedStarred = localStorage.getItem("starred-questions");
    if (storedStarred) {
      setStarredQuestions(JSON.parse(storedStarred) as number[]);
    }

    const storedWrong = localStorage.getItem("wrong-answered-questions");
    if (storedWrong) {
      setWronglyAnsweredQuestions(JSON.parse(storedWrong) as number[]);
    }

    // Fetch all questions across multiple tests
    const totalTests = 5;
    let allQuestions: QuestionType[] = []; // Explicitly typed as an array of QuestionType

    for (let testNumber = 1; testNumber <= totalTests; testNumber++) {
      const questionsData = getQuestionsForTest(testNumber);
      allQuestions = [...allQuestions, ...questionsData];
    }

    setQuestions(allQuestions);
  }, []);

  const toggleStar = (id: number) => {
    const newStarredQuestions = [...starredQuestions];
    const index = newStarredQuestions.indexOf(id);

    if (index === -1) {
      newStarredQuestions.push(id);
    } else {
      newStarredQuestions.splice(index, 1);
    }

    setStarredQuestions(newStarredQuestions);
    localStorage.setItem(
      "starred-questions",
      JSON.stringify(newStarredQuestions)
    );
  };

  //   const formatTime = (seconds: number) => {
  //     const mins = Math.floor(seconds / 60);
  //     const secs = seconds % 60;
  //     return `${mins}m ${secs}s`;
  //   };

  const isPassed = parseInt(score || "0", 10) >= 15;

  const renderQuestions = (questionsToShow: number[]) => {
    return questions
      .filter((q) => questionsToShow.includes(q.id))
      .map((q) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.answer;
        const isStarred = starredQuestions.includes(q.id);
        //const isWrong = !isCorrect;

        return (
          <div
            key={q.id}
            className={`flex flex-col p-3 rounded-md max-w-xl w-full h-full ${
              isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-base-500 text-sm">{`QUESTION ${q.id} OF 20`}</p>
              <div className="cursor-pointer" onClick={() => toggleStar(q.id)}>
                {isStarred ? (
                  <Star className="text-yellow-500" />
                ) : (
                  <StarOff className="text-gray-500" />
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
                  bgColor = "bg-green-600 text-white"; // Highlight correct answer
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
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium">Review Results</h1>
        <h2 className="text-base-950 font-medium text-xl mt-2">
          Test Result: {isPassed ? "PASS" : "FAIL"}
        </h2>
        <p className="text-base-700 font-normal text-sm text-center">
          You need 15 correct answers in 45 minutes to pass the test.
        </p>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 ${
            tab === "review" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("review")}
        >
          Reviewed Questions
        </button>
        <button
          className={`px-4 py-2 ${
            tab === "wrong" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("wrong")}
        >
          Wrongly Answered Questions
        </button>
      </div>

      <div className="w-full max-w-6xl">
        {tab === "review" && renderQuestions(starredQuestions)}
        {tab === "wrong" && renderQuestions(wronglyAnsweredQuestions)}
      </div>
    </div>
  );
}
