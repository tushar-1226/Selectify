import type { Route } from "./+types/api.analyze";
import { analyzeResume, generateInsights, extractResumeInfo } from "~/lib/gemini";
import { json } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const resumeText = formData.get("resumeText") as string;
    const jobDescription = formData.get("jobDescription") as string;

    if (!resumeText || !jobDescription) {
      return json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Extract resume info
    const resumeInfo = await extractResumeInfo(resumeText);

    // Analyze resume against job description
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Generate insights
    const insights = await generateInsights(resumeText, analysis);

    return json({
      success: true,
      data: {
        resumeInfo,
        analysis,
        insights,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
