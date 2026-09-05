"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/master/seafarers");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Redirecting to Seafarer Management...</p>
      </div>
    </div>
  );
}
