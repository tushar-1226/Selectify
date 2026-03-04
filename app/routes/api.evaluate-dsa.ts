import type { Route } from "./+types/api.evaluate-dsa";
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
    const code = formData.get("code") as string;
    const language = formData.get("language") as string;
    const problemTitle = formData.get("problemTitle") as string;
    const problemDescription = formData.get("problemDescription") as string;
    const examples = formData.get("examples") as string;

    if (!code || !problemTitle) {
      return Response.json({ error: "Code and problem are required" }, { status: 400 });
    }

    const prompt = `You are an expert coding interviewer and algorithm specialist. A user has submitted a solution to a DSA problem. Evaluate their code rigorously.

PROBLEM: ${problemTitle}
DESCRIPTION: ${problemDescription}

EXAMPLES:
${examples}

USER'S CODE (${language}):
${code}

Analyze the code and provide a JSON response:
{
  "isCorrect": <true if the solution is logically correct for all cases, false otherwise>,
  "explanation": "<detailed explanation of why the solution is correct or incorrect, mention specific test cases>",
  "timeComplexity": "<e.g. O(n), O(n log n)>",
  "spaceComplexity": "<e.g. O(1), O(n)>",
  "suggestions": ["<specific improvements or alternative approaches>"],
  "edgeCasesCovered": <true if the solution handles edge cases well>
}

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
    console.error("DSA evaluation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to evaluate code" },
      { status: 500 }
    );
  }
}
