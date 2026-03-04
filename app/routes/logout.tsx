import { logout } from "~/lib/session.server";

export async function action({ request }: { request: Request }) {
  return logout(request);
}

// GET request also logs out (for simple link-based logout)
export async function loader({ request }: { request: Request }) {
  return logout(request);
}
