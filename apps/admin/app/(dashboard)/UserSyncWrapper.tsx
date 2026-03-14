"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useEnsureUser } from "@neuro-cart/shared/hooks";
import { useRouter } from "next/navigation";

export function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEnsureUser(user, "Admin");

  if (!isLoaded || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="loading-spinner" aria-label="Loading" role="status" />
      </div>
    );
  }

  return <>{children}</>;
}
