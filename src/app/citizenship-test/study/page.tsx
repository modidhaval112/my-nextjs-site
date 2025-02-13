"use client";

import { useState } from "react";
import Link from "next/link";

const chapters = [
  { title: "Applying for Citizenship", keynotes: 10, questions: 3 },
  {
    title: "Rights and Responsibilities of Citizenship",
    keynotes: 20,
    questions: 34,
  },
  { title: "Who We Are", keynotes: 22, questions: 30 },
  { title: "Canada’s History", keynotes: 30, questions: 84 },
  { title: "Modern Canada", keynotes: 26, questions: 26 },
  { title: "How Canadians Govern Themselves", keynotes: 19, questions: 54 },
  { title: "Federal Elections", keynotes: 16, questions: 49 },
  { title: "The Justice System", keynotes: 17, questions: 15 },
  { title: "Canadian Symbols", keynotes: 40, questions: 33 },
  { title: "Canada’s Economy", keynotes: 13, questions: 12 },
  { title: "Canada’s Regions", keynotes: 29, questions: 60 },
];

const categories = [
  {
    title: "Timeline",
    description: "Important events sorted by time",
    icon: "📅",
  },
  { title: "Names", description: "Names worth remembering", icon: "👤" },
  {
    title: "Canada",
    description: "People, regions and symbols etc.",
    icon: "🇨🇦",
  },
  {
    title: "Citizenship",
    description: "Rights and responsibilities",
    icon: "📜",
  },
  {
    title: "Politics",
    description: "Government and political system",
    icon: "🏛️",
  },
];

export default function StudySection() {
  const [activeTab, setActiveTab] = useState("chapters");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        &quot;Discover Canada&quot; Study Guide
      </h2>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "chapters" ? "bg-gray-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("chapters")}
        >
          Chapters
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "categories"
              ? "bg-gray-900 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
      </div>

      {activeTab === "chapters" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => (
            <Link
              href={`#${chapter.title.replace(/\s+/g, "-").toLowerCase()}`}
              key={chapter.title}
              className="border p-4 rounded-lg shadow block no-underline text-black"
            >
              <h3 className="font-semibold">{chapter.title}</h3>
              <p className="text-sm text-gray-600">
                📄 {chapter.keynotes} Keynotes
              </p>
              <p className="text-sm text-gray-600">
                ✍️ {chapter.questions} Questions
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              href={`#${category.title.replace(/\s+/g, "-").toLowerCase()}`}
              key={category.title}
              className="border p-4 rounded-lg shadow flex flex-col items-center block no-underline text-black"
            >
              <span className="text-3xl">{category.icon}</span>
              <h3 className="font-semibold mt-2">{category.title}</h3>
              <p className="text-sm text-gray-600 text-center">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
