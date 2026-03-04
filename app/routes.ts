import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/upload", "routes/upload.tsx"),
        route("/resume/:id", "routes/resume.tsx"),
        route("/analysis", "routes/analysis.tsx"),
        route("/job-matches", "routes/job-matches.tsx"),
        route("/resume-editor", "routes/resume-editor.tsx"),
        route("/interview-prep", "routes/interview-prep.tsx"),
        route("/career-path", "routes/career-path.tsx"),
        route("/dsa-practice", "routes/dsa-practice.tsx"),
        route("/dsa-practice/:id", "routes/dsa-problem.$id.tsx"),
        route("/dsa-report", "routes/dsa-report.tsx"),
        route("/mock-interview", "routes/mock-interview.tsx"),
        route("/mock-session", "routes/mock-session.tsx"),
    ]),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/logout", "routes/logout.tsx"),
    route("/api/analyze", "routes/api.analyze.ts"),
    route("/api/evaluate-dsa", "routes/api.evaluate-dsa.ts"),
    route("/api/evaluate-mock", "routes/api.evaluate-mock.ts"),
    route("/api/generate-questions", "routes/api.generate-questions.ts"),
] satisfies RouteConfig;
