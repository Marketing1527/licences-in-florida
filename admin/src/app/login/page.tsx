"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { asset } from "@/lib/paths";

export default function LoginPage() {
  const { login, auth } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("admin@licencesinflorida.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth) router.replace("/dashboard");
  }, [auth, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(email.trim(), password);
    if (!ok) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-[#002D62]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <img
            src={asset("/logo.png")}
            alt="Licenses in Florida"
            className="mx-auto h-16 w-auto object-contain sm:h-20"
          />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm text-[#5A6A7A]">
            Sign in to manage clients, licenses, documents, and payments.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20"
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#FF8C00] py-3.5 font-semibold text-white transition-colors hover:bg-[#E67E00]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-[#5A6A7A]">
          Demo: <strong>admin@licencesinflorida.com</strong> / <strong>Licenses2026!</strong>
          <br />
          (or admin / admin)
        </p>
      </div>
    </div>
  );
}
