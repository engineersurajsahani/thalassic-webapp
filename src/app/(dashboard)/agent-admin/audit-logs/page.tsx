"use client";

import React from "react";
import AccessRestricted from "@/components/common/AccessRestricted";

export default function AuditLogs() {
  return (
    <AccessRestricted
      featureName="Audit Logs"
      restrictedItems={[
        "System Audit Logs & Audit Ledger",
        "Administrative Action History",
        "Credential Reset Logs",
        "Master Portal Functions",
        "Company Admin Functions",
        "Master-level Reports",
        "Other Partners' Information & Seafarers",
        "Other Partners' Invoices & Settlements",
      ]}
    />
  );
}

