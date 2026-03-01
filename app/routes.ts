import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/upload", "routes/upload.tsx"),
        route("/resume/:id", "routes/resume.tsx"),
        route("/job-matches", "routes/job-matches.tsx"),
        route("/resume-editor", "routes/resume-editor.tsx"),
        route("/interview-prep", "routes/interview-prep.tsx"),
    ]),
    route("/auth", "routes/auth.tsx"),
    route("/wipe", "routes/wipe.tsx"),
] satisfies RouteConfig;
