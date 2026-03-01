import { Outlet, useNavigate } from "react-router";
import AppLayout from "~/components/AppLayout";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";

export default function LayoutRoute() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, navigate]);

  if (!auth.isAuthenticated) return null;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
