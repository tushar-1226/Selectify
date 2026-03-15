import type { Route } from "./+types/api.interview-questions";
import { generateInterviewQuestions } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { resumeText, jobDescription, jobTitle } = data;

    if (!resumeText || !jobDescription || !jobTitle) {
      return Response.json(
        { error: "Resume text, job description, and job title are required" },
        { status: 400 }
      );
    }

    const result = await generateInterviewQuestions(resumeText, jobDescription, jobTitle);
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Interview questions API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
