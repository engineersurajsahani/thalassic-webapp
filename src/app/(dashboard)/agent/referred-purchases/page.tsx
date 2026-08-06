"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferredPurchasesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/agent/referral-leads");
  }, [router]);

  return null;
}
