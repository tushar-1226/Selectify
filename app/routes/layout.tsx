import { Outlet, useLoaderData } from "react-router";
import AppLayout from "~/components/AppLayout";
import { getUser } from "~/lib/session.server";
import { redirect } from "react-router";

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) {
    const url = new URL(request.url);
    throw redirect(`/login?next=${encodeURIComponent(url.pathname)}`);
  }
  return { user };
}

export default function LayoutRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AppLayout user={user}>
      <Outlet context={{ user }} />
    </AppLayout>
  );
}
