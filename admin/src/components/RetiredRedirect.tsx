"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Retired modules redirect into the simplified console */
export default function RetiredRedirect({ to = "/dashboard" }: { to?: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <div className="grid min-h-[40vh] place-items-center text-sm text-[#5A6A7A]">
      Redirecting…
    </div>
  );
}
