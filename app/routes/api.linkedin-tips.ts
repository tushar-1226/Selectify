import type { Route } from "./+types/api.linkedin-tips";
import { generateLinkedInTips } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { resumeText, currentRole, targetRole } = data;

    if (!resumeText || !currentRole || !targetRole) {
      return Response.json(
        { error: "Resume text, current role, and target role are required" },
        { status: 400 }
      );
    }

    const result = await generateLinkedInTips(resumeText, currentRole, targetRole);
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("LinkedIn tips API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
