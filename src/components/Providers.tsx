"use client";

import { SessionProvider } from "next-auth/react";

/** Client session context. Wrapping the tree is safe with no auth configured —
 *  useSession() simply resolves to "unauthenticated". */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
