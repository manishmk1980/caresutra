"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid username or password.");
        return;
      }
      if (!data.success) {
        setError("Sign in failed.");
        return;
      }
      const dest = searchParams?.get("from");
      router.push(dest && dest.startsWith("/admin") && !dest.startsWith("/admin/login") ? dest : "/admin/activity");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-ivory">
      <div className="w-full max-w-md rounded-2xl border border-soft-gold/40 bg-white p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="relative w-[220px] h-16">
            <Image
              src="/caresutra-hr-logo.svg"
              alt="CareSutra"
              fill
              className="object-contain"
              priority
              sizes="220px"
            />
          </div>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-charcoal text-center mb-2">Admin sign in</h1>
        <p className="text-sm text-charcoal/70 text-center mb-8">CareSutra dashboard access</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-username" className="text-charcoal">
              Username
            </Label>
            <Input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-xl border-soft-gold/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-charcoal">
              Password
            </Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-soft-gold/40"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-trust-blue hover:bg-support-blue text-white py-6 font-medium"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal/60">
          <Link href="/" className="text-support-blue hover:text-trust-blue underline-offset-2 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-ivory">
          <p className="text-charcoal/70">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
