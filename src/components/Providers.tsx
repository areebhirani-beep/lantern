"use client";

import { SessionProvider } from "next-auth/react";

/** Client session context. Only mounted when auth is configured — without an
 *  AUTH_SECRET the session endpoint 500s, so mounting SessionProvider would spam
 *  console errors and strand a non-functional Sign-in. `enabled` comes from the
 *  server (authConfigured). When off, the tree renders with no session layer. */
export function Providers({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  if (!enabled) return <>{children}</>;
  return <SessionProvider>{children}</SessionProvider>;
}
