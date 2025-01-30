import questions from "@/data/questions.json";

// Function to get questions for a specific test
export function getQuestionsForTest(testNumber: number) {
  return questions.filter((q) => q.testNumber === testNumber);
}
