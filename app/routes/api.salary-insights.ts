import type { Route } from "./+types/api.salary-insights";
import { generateSalaryInsights } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { jobTitle, location, skills, experienceYears } = data;

    if (!jobTitle || !location) {
      return Response.json(
        { error: "Job title and location are required" },
        { status: 400 }
      );
    }

    const result = await generateSalaryInsights(
      jobTitle,
      location,
      skills || [],
      experienceYears || 0
    );
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Salary insights API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
