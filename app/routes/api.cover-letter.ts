import type { Route } from "./+types/api.cover-letter";
import { generateCoverLetter } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { resumeText, jobDescription, companyName, jobTitle } = data;

    if (!resumeText || !jobDescription || !companyName || !jobTitle) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await generateCoverLetter(resumeText, jobDescription, companyName, jobTitle);
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Cover letter API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
