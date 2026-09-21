"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalRemoved() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <div className="grid min-h-screen place-items-center text-[#5A6A7A]">
      Portal preview removed — redirecting to admin…
    </div>
  );
}
