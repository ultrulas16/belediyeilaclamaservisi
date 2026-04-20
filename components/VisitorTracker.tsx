"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/app/actions";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Prevent tracking internal navigations multiple times if pathname hasn't actually changed
    // and ignore admin routes to not clutter analytics with own visits
    if (pathname === lastTrackedPath.current || pathname.startsWith("/admin")) {
      return;
    }

    const logVisit = async () => {
      // Get the real referrer on the first load
      const referrer = document.referrer;
      await trackVisit(pathname, referrer || undefined);
      lastTrackedPath.current = pathname;
    };

    logVisit();
  }, [pathname]);

  return null; // This component doesn't render anything
}
