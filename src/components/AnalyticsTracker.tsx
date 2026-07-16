"use client";

import { useEffect } from "react";

export default function AnalyticsTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const logView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      } catch (err) {
        console.error("Failed to log view:", err);
      }
    };

    logView();
  }, [slug]);

  return null; // This is a headless logic component
}
