import type { Route } from "./+types/api.course-recommendations";
import { recommendCourses } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { currentSkills, missingSkills, targetRole } = data;

    if (!targetRole) {
      return Response.json(
        { error: "Target role is required" },
        { status: 400 }
      );
    }

    const result = await recommendCourses(
      currentSkills || [],
      missingSkills || [],
      targetRole
    );
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Course recommendations API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
