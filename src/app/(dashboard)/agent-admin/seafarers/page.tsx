"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferredSeafarersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/agent-admin/referral-leads");
  }, [router]);

  return null;
}
