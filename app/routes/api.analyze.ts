import type { Route } from "./+types/api.analyze";
import { analyzeResume, generateInsights, extractResumeInfo } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const contentType = request.headers.get("Content-Type") || "";

    // JSON body = save intent
    if (contentType.includes("application/json")) {
      // Implement backend logic for saving resume analysis here
      return Response.json({ error: "Backend not implemented" }, { status: 501 });
    }

    // FormData body = analyze intent
    const formData = await request.formData();
    const resumeText = formData.get("resumeText") as string;
    const jobDescription = formData.get("jobDescription") as string;

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const resumeInfo = await extractResumeInfo(resumeText);
    const analysis = await analyzeResume(resumeText, jobDescription);
    const insights = await generateInsights(resumeText, analysis);

    return Response.json({
      success: true,
      data: {
        resumeInfo,
        analysis,
        insights,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
