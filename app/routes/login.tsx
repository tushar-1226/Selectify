import { Form, Link, useSearchParams, useActionData } from "react-router";
import AnimatedBackground from "~/components/AnimatedBackground";
import { loginUser, createUserSession } from "~/lib/session.server";

export const meta = () => ([
  { title: 'Selectify | Login' },
  { name: 'description', content: 'Log into your Selectify account' },
]);

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/";

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const result = await loginUser(email, password);
  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  // Expect result.token from backend
  if (!result.token) {
    return Response.json({ error: "No token returned from backend." }, { status: 500 });
  }
  return createUserSession(result.token, next);
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";
  const actionData = useActionData<{ error?: string }>();

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden selection:bg-primary-500 selection:text-white">
      <AnimatedBackground />

      <div className="w-full max-w-md mx-auto p-4 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <section className="flex flex-col gap-6 glass-card p-10 md:p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/30 mb-2">
              <span className="text-white font-bold text-3xl leading-none">S</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-0">Welcome Back</h1>
            <p className="text-slate-400">Log in to track your resume performance.</p>
          </div>

          {actionData?.error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="flex flex-col gap-4 text-left">
            <input type="hidden" name="next" value={next} />
            <div className="form-div">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
            <div className="form-div">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
            <button type="submit" className="primary-button w-full flex items-center justify-center gap-2 group mt-2">
              <span>Sign In</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Form>

          <p className="text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to={`/register?next=${encodeURIComponent(next)}`} className="text-sky-400 hover:text-sky-300 font-medium">
              Create one →
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
