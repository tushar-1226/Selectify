import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface ResumeAnalysisResult {
  atsScore: number;
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  improvements: string[];
  summary: string;
}

export interface SkillMatchResult {
  category: string;
  percentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CareerInsight {
  title: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
}

/**
 * Analyze resume against job description using Gemini AI
 */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<ResumeAnalysisResult> {
  const prompt = `You are an expert HR recruiter and ATS (Applicant Tracking System) specialist. 
Analyze the following resume against the job description and provide detailed feedback.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "atsScore": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "strengths": [<array of 3-4 key strengths>],
  "weaknesses": [<array of 3-4 areas to improve>],
  "keywords": [<array of important keywords from job description>],
  "improvements": [<array of 3-4 specific actionable improvements for the resume>],
  "summary": "<2-3 sentence summary of the match>"
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const analysis = JSON.parse(jsonMatch[0]) as ResumeAnalysisResult;
    return analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}

/**
 * Calculate skill match across different job categories
 */
export async function calculateSkillMatches(
  resumeSkills: string[],
  targetCategories: string[]
): Promise<SkillMatchResult[]> {
  const prompt = `You are a career development expert. Analyze how well these resume skills match different job categories.

RESUME SKILLS:
${resumeSkills.join(", ")}

JOB CATEGORIES:
${targetCategories.join(", ")}

For each job category, provide a JSON array with this structure:
[
  {
    "category": "<job category>",
    "percentage": <0-100>,
    "matchedSkills": [<skills that match this category>],
    "missingSkills": [<important skills missing for this category>]
  }
]

Return ONLY valid JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const matches = JSON.parse(jsonMatch[0]) as SkillMatchResult[];
    return matches;
  } catch (error) {
    console.error("Error calculating skill matches:", error);
    throw new Error("Failed to calculate skill matches.");
  }
}

/**
 * Generate AI-powered improvement insights
 */
export async function generateInsights(
  resumeText: string,
  analysisData: ResumeAnalysisResult
): Promise<CareerInsight[]> {
  const prompt = `You are a career coach and resume optimization expert. Based on the resume analysis, provide 3 specific, actionable insights to improve career prospects.

RESUME CONTENT (excerpt):
${resumeText.substring(0, 500)}

ANALYSIS DATA:
- ATS Score: ${analysisData.atsScore}/100
- Weaknesses: ${analysisData.weaknesses.join(", ")}
- Suggested Improvements: ${analysisData.improvements.join(", ")}

Provide insights as JSON array:
[
  {
    "title": "<insight title>",
    "description": "<detailed description of the insight>",
    "icon": "<emoji icon>",
    "priority": "<high|medium|low>"
  }
]

Return ONLY valid JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const insights = JSON.parse(jsonMatch[0]) as CareerInsight[];
    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error("Failed to generate insights.");
  }
}

/**
 * Generate career path recommendations
 */
export async function generateCareerPath(
  currentRole: string,
  skills: string[],
  experience: string
): Promise<{
  paths: Array<{
    title: string;
    demand: string;
    description: string;
    skillGaps: string[];
    certifications: string[];
  }>;
}> {
  const prompt = `You are a career development strategist. Based on the provided profile, recommend 2 potential career growth paths.

CURRENT ROLE: ${currentRole}
SKILLS: ${skills.join(", ")}
EXPERIENCE: ${experience}

Provide recommendations as JSON:
{
  "paths": [
    {
      "title": "<career path title>",
      "demand": "<High|Stable|Growing>",
      "description": "<why this is a good path>",
      "skillGaps": [<skills to develop>],
      "certifications": [<recommended certifications>]
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const careerData = JSON.parse(jsonMatch[0]);
    return careerData;
  } catch (error) {
    console.error("Error generating career path:", error);
    throw new Error("Failed to generate career path.");
  }
}

/**
 * Extract text and key information from resume
 */
export async function extractResumeInfo(resumeText: string): Promise<{
  fullName: string;
  currentRole: string;
  skills: string[];
  experience: string;
  summary: string;
}> {
  const prompt = `Extract key professional information from this resume. Return as JSON:
{
  "fullName": "<name>",
  "currentRole": "<current job title>",
  "skills": [<array of skills>],
  "experience": "<years of experience>",
  "summary": "<brief professional summary>"
}

RESUME:
${resumeText}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const info = JSON.parse(jsonMatch[0]);
    return info;
  } catch (error) {
    console.error("Error extracting resume info:", error);
    throw new Error("Failed to extract resume information.");
  }
}
