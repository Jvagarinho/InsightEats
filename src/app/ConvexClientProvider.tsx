"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, Authenticated, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function UserSync() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.getOrCreateForCurrentUser);

  useEffect(() => {
    if (user) {
      // Sync user to Convex on login/load
      storeUser({});
    }
  }, [user, storeUser]);

  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>
          <UserSync />
        </Authenticated>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
