import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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


export interface CoverLetterResult {
  coverLetter: string;
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  jobTitle: string
): Promise<CoverLetterResult> {
  const prompt = `You are an expert career coach and professional writer. Write a compelling, tailored cover letter.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

COMPANY: ${companyName}
JOB TITLE: ${jobTitle}

Write a professional cover letter that:
- Opens with a strong hook specific to the company
- Highlights 2-3 most relevant achievements from the resume
- Maps skills directly to job requirements
- Shows genuine enthusiasm for the role and company
- Closes with a confident call to action
- Is 3-4 paragraphs, roughly 300-400 words

Return as JSON:
{
  "coverLetter": "<the full cover letter text>"
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]) as CoverLetterResult;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter.");
  }
}


export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  suggestedAnswer: string;
}

export async function generateInterviewQuestions(
  resumeText: string,
  jobDescription: string,
  jobTitle: string
): Promise<{ questions: InterviewQuestion[] }> {
  const prompt = `You are a senior technical interviewer. Generate 8 interview questions tailored to this candidate and role.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

JOB TITLE: ${jobTitle}

Include a mix of:
- 2 behavioral questions
- 2 technical questions specific to the job
- 2 situational/problem-solving questions
- 2 questions about the candidate's specific experience

Return as JSON:
{
  "questions": [
    {
      "question": "<the question>",
      "category": "<behavioral|technical|situational|experience>",
      "difficulty": "<easy|medium|hard>",
      "suggestedAnswer": "<a strong sample answer the candidate could give, 2-3 sentences>"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions.");
  }
}


export interface LinkedInTip {
  section: string;
  currentIssue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export async function generateLinkedInTips(
  resumeText: string,
  currentRole: string,
  targetRole: string
): Promise<{ tips: LinkedInTip[] }> {
  const prompt = `You are a LinkedIn profile optimization expert. Based on this resume, provide specific tips to optimize the user's LinkedIn profile for their target role.

RESUME:
${resumeText}

CURRENT ROLE: ${currentRole}
TARGET ROLE: ${targetRole}

Analyze and provide tips for these LinkedIn sections:
- Headline
- About/Summary
- Experience descriptions
- Skills & Endorsements
- Featured section
- Recommendations strategy

Return as JSON:
{
  "tips": [
    {
      "section": "<LinkedIn section name>",
      "currentIssue": "<what's likely wrong or missing>",
      "suggestion": "<specific actionable improvement>",
      "priority": "<high|medium|low>"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating LinkedIn tips:", error);
    throw new Error("Failed to generate LinkedIn tips.");
  }
}


export interface SalaryInsightsResult {
  salary: {
    min: number;
    median: number;
    max: number;
    currency: string;
  };
  negotiationTips: string[];
  marketDemand: string;
  demandLevel: "high" | "medium" | "low";
  growthOutlook: string;
}

export async function generateSalaryInsights(
  jobTitle: string,
  location: string,
  skills: string[],
  experienceYears: number
): Promise<SalaryInsightsResult> {
  const prompt = `You are a compensation analyst and career strategist. Provide salary insights for this role.

JOB TITLE: ${jobTitle}
LOCATION: ${location}
KEY SKILLS: ${skills.join(", ")}
YEARS OF EXPERIENCE: ${experienceYears}

Provide realistic salary estimates and negotiation advice.

Return as JSON:
{
  "salary": {
    "min": <number in USD>,
    "median": <number in USD>,
    "max": <number in USD>,
    "currency": "USD"
  },
  "negotiationTips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>"],
  "marketDemand": "<brief description of current market demand>",
  "demandLevel": "<high|medium|low>",
  "growthOutlook": "<brief 1-2 sentence outlook for this role>"
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]) as SalaryInsightsResult;
  } catch (error) {
    console.error("Error generating salary insights:", error);
    throw new Error("Failed to generate salary insights.");
  }
}


export interface EmailTemplateResult {
  subject: string;
  body: string;
}

export async function generateEmailTemplate(
  resumeText: string,
  companyName: string,
  jobTitle: string,
  templateType: "application" | "follow-up" | "networking" | "thank-you"
): Promise<EmailTemplateResult> {
  const typeDescriptions: Record<string, string> = {
    application: "a job application email to accompany a resume submission",
    "follow-up": "a follow-up email after submitting an application (1-2 weeks later)",
    networking: "a cold networking email to a professional at the company",
    "thank-you": "a thank-you email after a job interview",
  };

  const prompt = `You are an expert professional communication writer. Write ${typeDescriptions[templateType]}.

RESUME CONTEXT:
${resumeText.substring(0, 800)}

COMPANY: ${companyName}
JOB TITLE: ${jobTitle}
EMAIL TYPE: ${templateType}

The email should be:
- Professional but personable
- Concise (under 200 words for the body)
- Specific to the company and role
- Have a compelling subject line

Return as JSON:
{
  "subject": "<email subject line>",
  "body": "<full email body text>"
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]) as EmailTemplateResult;
  } catch (error) {
    console.error("Error generating email template:", error);
    throw new Error("Failed to generate email template.");
  }
}


export interface ATSIssue {
  type: string;
  description: string;
  severity: "critical" | "warning" | "info";
  fix: string;
}

export interface ATSCheckResult {
  score: number;
  issues: ATSIssue[];
  summary: string;
}

export async function checkATSFormatting(
  resumeText: string
): Promise<ATSCheckResult> {
  const prompt = `You are an ATS (Applicant Tracking System) formatting expert. Analyze this resume text for formatting issues that commonly cause problems with ATS parsers.

RESUME TEXT:
${resumeText}

Check for:
- Missing standard sections (Contact Info, Summary, Experience, Education, Skills)
- Non-standard section headers that ATS might not recognize
- Use of special characters or symbols that ATS struggles with
- Inconsistent date formatting
- Missing quantifiable achievements
- Keyword stuffing or lack of relevant keywords
- Poor structure that would confuse parsers

Return as JSON:
{
  "score": <0-100 formatting health score>,
  "issues": [
    {
      "type": "<missing_section|formatting|structure|keywords|dates|other>",
      "description": "<what the issue is>",
      "severity": "<critical|warning|info>",
      "fix": "<specific fix recommendation>"
    }
  ],
  "summary": "<1-2 sentence overall assessment>"
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]) as ATSCheckResult;
  } catch (error) {
    console.error("Error checking ATS formatting:", error);
    throw new Error("Failed to check ATS formatting.");
  }
}


export interface CourseRecommendation {
  title: string;
  platform: string;
  url: string;
  relevance: number;
  estimatedHours: number;
  skillCovered: string;
}

export async function recommendCourses(
  currentSkills: string[],
  missingSkills: string[],
  targetRole: string
): Promise<{ courses: CourseRecommendation[] }> {
  const prompt = `You are a learning and development advisor. Recommend specific online courses to bridge skill gaps for this career transition.

CURRENT SKILLS: ${currentSkills.join(", ")}
MISSING/WEAK SKILLS: ${missingSkills.join(", ")}
TARGET ROLE: ${targetRole}

Recommend 6-8 specific, real courses from platforms like Coursera, Udemy, edX, LinkedIn Learning, or Pluralsight. Prioritize skills most critical for the target role.

Return as JSON:
{
  "courses": [
    {
      "title": "<exact course title>",
      "platform": "<Coursera|Udemy|edX|LinkedIn Learning|Pluralsight>",
      "url": "<realistic URL to the course>",
      "relevance": <1-100 relevance score>,
      "estimatedHours": <number>,
      "skillCovered": "<which missing skill this addresses>"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error recommending courses:", error);
    throw new Error("Failed to recommend courses.");
  }
}
