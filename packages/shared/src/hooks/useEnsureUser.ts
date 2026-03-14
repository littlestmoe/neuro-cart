"use client";

import { useEffect, useRef } from "react";
import { useUserProfiles } from "./useUser";

interface ClerkUserLike {
  id: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
}

export function useEnsureUser(
  clerkUser: ClerkUserLike | null | undefined,
  defaultRole: "Buyer" | "Seller" | "Admin" = "Buyer",
) {
  const { currentUser, createUser, connected } = useUserProfiles(clerkUser?.id);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!clerkUser || !connected) return;
    if (syncedRef.current === clerkUser.id) return;
    if (currentUser) {
      syncedRef.current = clerkUser.id;
      return;
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress || "";
    const firstName =
      clerkUser.firstName || clerkUser.fullName?.split(" ")[0] || "User";
    const lastName =
      clerkUser.lastName ||
      clerkUser.fullName?.split(" ").slice(1).join(" ") ||
      "";

    createUser({
      clerkId: clerkUser.id,
      email,
      firstName,
      lastName,
      role: { tag: defaultRole },
    });

    syncedRef.current = clerkUser.id;
  }, [clerkUser, connected, currentUser, createUser, defaultRole]);

  return currentUser;
}

export function useEnsureSellerProfile(
  clerkUser: ClerkUserLike | null | undefined,
) {
  const { currentUser, sellerProfiles, createSeller, connected } =
    useUserProfiles(clerkUser?.id);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!clerkUser || !connected || !currentUser) return;
    if (syncedRef.current === currentUser.id) return;

    const existing = sellerProfiles.find((s) => s.userId === currentUser.id);
    if (existing) {
      syncedRef.current = currentUser.id;
      return;
    }

    createSeller({
      userId: currentUser.id,
      storeName: `${currentUser.firstName}'s Store`,
      storeDescription: undefined,
    });

    syncedRef.current = currentUser.id;
  }, [clerkUser, connected, currentUser, sellerProfiles, createSeller]);

  return sellerProfiles.find((s) => s.userId === currentUser?.id) ?? null;
}
