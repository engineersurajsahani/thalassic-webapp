"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerCoursePricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/agent-admin/dashboard");
  }, [router]);

  return null;
}
