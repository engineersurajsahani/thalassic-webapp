"use client";

import React from "react";
import AccessRestricted from "@/components/common/AccessRestricted";

export default function SeafarersPage() {
  return (
    <AccessRestricted
      featureName="Other Partners' Seafarers"
      restrictedItems={[
        "Other Partners' Seafarer Records & Applications",
        "Global Seafarer Directory",
        "Master Portal Functions",
        "Company Admin Functions",
        "Master-level Reports",
        "Audit Logs & Referral Tracker",
        "Commission Information",
      ]}
    />
  );
}
