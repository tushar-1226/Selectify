import { useState } from "react";

export interface AnalysisResponse {
  resumeInfo: {
    fullName: string;
    currentRole: string;
    skills: string[];
    experience: string;
    summary: string;
  };
  analysis: {
    atsScore: number;
    matchPercentage: number;
    strengths: string[];
    weaknesses: string[];
    keywords: string[];
    improvements: string[];
    summary: string;
  };
  insights: Array<{
    title: string;
    description: string;
    icon: string;
    priority: "high" | "medium" | "low";
  }>;
}

export function useResumeAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResponse | null>(null);

  const analyze = async (resumeText: string, jobDescription: string) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resumeText", resumeText);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, data };
}
