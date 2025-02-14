"use client";

import { useState, useEffect } from "react";
import { getQuestionsForTest } from "@/utils/getQuestions";
import { Star, StarOff } from "lucide-react";

type AnswersType = { [key: number]: string };

type QuestionType = {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

export default function ReviewPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<AnswersType>({});
  const [starredQuestions, setStarredQuestions] = useState<number[]>([]);
  const [wronglyAnsweredQuestions, setWronglyAnsweredQuestions] = useState<
    number[]
  >([]);
  const [tab, setTab] = useState("review");

  useEffect(() => {
    const storedAnswers = localStorage.getItem("test-answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    const storedStarred = localStorage.getItem("starred-questions");
    if (storedStarred) {
      setStarredQuestions(JSON.parse(storedStarred));
    }

    const storedWrong = localStorage.getItem("wrong-answered-questions");
    if (storedWrong) {
      setWronglyAnsweredQuestions(JSON.parse(storedWrong));
    }

    const totalTests = 5;
    let allQuestions: QuestionType[] = [];

    for (let testNumber = 1; testNumber <= totalTests; testNumber++) {
      const questionsData = getQuestionsForTest(testNumber);
      allQuestions = [...allQuestions, ...questionsData];
    }

    setQuestions(allQuestions);
  }, []);

  useEffect(() => {
    if (starredQuestions.length > 0) {
      localStorage.setItem(
        "starred-questions",
        JSON.stringify(starredQuestions)
      );
    }
  }, [starredQuestions]);

  useEffect(() => {
    if (wronglyAnsweredQuestions.length > 0) {
      localStorage.setItem(
        "wrong-answered-questions",
        JSON.stringify(wronglyAnsweredQuestions)
      );
    }
  }, [wronglyAnsweredQuestions]);

  const toggleStar = (id: number) => {
    setStarredQuestions((prevStarred) => {
      const newStarredQuestions = prevStarred.includes(id)
        ? prevStarred.filter((qId) => qId !== id)
        : [...prevStarred, id];
      return newStarredQuestions;
    });
  };

  const renderQuestions = (questionsToShow: number[]) => {
    return questions
      .filter((q) => questionsToShow.includes(q.id))
      .map((q) => {
        const userAnswer = answers[q.id];
        const isStarred = starredQuestions.includes(q.id);

        return (
          <div
            key={q.id}
            className={`flex flex-col p-3 rounded-md max-w-xl w-full h-full border border-zinc-200`}
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
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
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
        <div className="grid grid-cols-2 gap-6">
          {tab === "review" && renderQuestions(starredQuestions)}
          {tab === "wrong" && renderQuestions(wronglyAnsweredQuestions)}
        </div>
      </div>
    </div>
  );
}
