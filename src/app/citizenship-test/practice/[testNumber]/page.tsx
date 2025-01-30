"use client";

import { use } from "react";
import Link from "next/link";
import { getQuestionsForTest } from "@/utils/getQuestions";

export default function PracticeTestPage({
  params,
}: {
  params: Promise<{ testNumber: string }>;
}) {
  console.log("PracticeTestPage component rendered"); // Debugging line

  const resolvedParams = use(params);
  const testNumberInt = parseInt(resolvedParams.testNumber, 10);

  // Fetch questions dynamically based on testNumber
  const questions = getQuestionsForTest(testNumberInt);

  return (
    <div>
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
}
