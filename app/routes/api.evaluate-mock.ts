import type { Route } from "./+types/api.evaluate-mock";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const questionType = formData.get("questionType") as string;

    if (!question || !answer) {
      return Response.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const prompt = `You are an expert ${questionType || "technical"} interviewer at a top tech company. A candidate was asked the following question and gave this answer.

QUESTION: ${question}

CANDIDATE'S ANSWER:
${answer}

Evaluate the answer and provide a JSON response:
{
  "score": <number 0-10>,
  "feedback": "<overall assessment of the answer quality, clarity, and completeness>",
  "strengths": ["<what the candidate did well>"],
  "improvements": ["<specific areas to improve with actionable advice>"]
}

Rate strictly but fairly. A score of 7+ means a strong answer. 4-6 is average. Below 4 is weak.

Return ONLY valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const evaluation = JSON.parse(jsonMatch[0]);
    return Response.json({ success: true, data: evaluation });
  } catch (error) {
    console.error("Mock evaluation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
