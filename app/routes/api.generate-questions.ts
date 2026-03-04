import type { Route } from "./+types/api.generate-questions";
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
    const type = formData.get("type") as string; // Technical, Behavioral, System Design, Mixed
    const difficulty = formData.get("difficulty") as string;
    const count = parseInt(formData.get("count") as string) || 5;
    const targetRole = formData.get("targetRole") as string;
    const resumeContext = formData.get("resumeContext") as string;

    const prompt = `You are a senior ${type || "technical"} interviewer at a top-tier tech company. Generate exactly ${count} interview questions for a candidate applying for a "${targetRole || "Software Engineer"}" role.

${resumeContext ? `CANDIDATE'S RESUME CONTEXT: ${resumeContext}` : ""}

DIFFICULTY: ${difficulty || "Medium"}
QUESTION TYPE: ${type || "Mixed"}

${type === "Technical" ? "Focus on algorithms, data structures, system design concepts, and coding patterns." : ""}
${type === "Behavioral" ? "Focus on leadership, teamwork, conflict resolution, using STAR method prompts." : ""}
${type === "System Design" ? "Focus on architecture, scalability, distributed systems, and trade-offs." : ""}

Generate questions as a JSON array:
[
  {
    "id": "<unique string id>",
    "question": "<the full interview question>",
    "type": "${type || "Technical"}",
    "difficulty": "${difficulty || "Medium"}"
  }
]

Make the questions specific, challenging, and realistic. Return ONLY valid JSON array, no additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const questions = JSON.parse(jsonMatch[0]);
    return Response.json({ success: true, data: questions });
  } catch (error) {
    console.error("Question generation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate questions" },
      { status: 500 }
    );
  }
}
