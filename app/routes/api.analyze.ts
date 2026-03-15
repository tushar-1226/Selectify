import type { Route } from "./+types/api.analyze";
import { analyzeResume, generateInsights, extractResumeInfo } from "~/lib/gemini";
import { getCookie, getUserId } from "~/lib/session.server";
import { BACKEND_URL } from "~/lib/config";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const contentType = request.headers.get("Content-Type") || "";

    // JSON body = save intent
    if (contentType.includes("application/json")) {
      const data = await request.json();
      
      const token = getCookie(request, "token");
      if (!token) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = await getUserId(request);
      
      const backendResponse = await fetch(`${BACKEND_URL}/api/resume-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          resumeText: data.resumeText,
          analysisData: data.analysisData
        })
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Backend error saving analysis:", errorData);
        return Response.json({ error: "Failed to save analysis to backend" }, { status: backendResponse.status });
      }

      const backendResult = await backendResponse.json();
      return Response.json(backendResult);
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
