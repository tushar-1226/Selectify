import type { Route } from "./+types/api.email-templates";
import { generateEmailTemplate } from "~/lib/gemini";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await request.json();
    const { resumeText, companyName, jobTitle, templateType } = data;

    if (!companyName || !jobTitle || !templateType) {
      return Response.json(
        { error: "Company name, job title, and template type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["application", "follow-up", "networking", "thank-you"];
    if (!validTypes.includes(templateType)) {
      return Response.json(
        { error: "Invalid template type" },
        { status: 400 }
      );
    }

    const result = await generateEmailTemplate(
      resumeText || "",
      companyName,
      jobTitle,
      templateType
    );
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Email template API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
