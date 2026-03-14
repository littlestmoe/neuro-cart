"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useEnsureUser } from "@neuro-cart/shared/hooks";

export function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  useEnsureUser(user, "Buyer");

  if (!isLoaded) {
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
