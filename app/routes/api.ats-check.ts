import type { Route } from "./+types/api.ats-check";
import { checkATSFormatting } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { resumeText } = data;

    if (!resumeText) {
      return Response.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    const result = await checkATSFormatting(resumeText);
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("ATS check API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
