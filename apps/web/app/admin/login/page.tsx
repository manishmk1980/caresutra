"use client"

import Image from "next/image"
import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }

      if (!response.ok || !result.success) {
        setError(result.error ?? "Invalid username or password.")
        return
      }

      const from = searchParams.get("from")
      const destination =
        from && from.startsWith("/admin") && !from.startsWith("/admin/login")
          ? from
          : "/admin"

      router.push(destination)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-soft-gold/40 bg-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-gradient-to-br from-trust-blue to-support-blue p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-medium text-white/75">
                CareSutra Admin
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight">
                Manage guidance requests with clarity and trust.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                Access customer records, service activity, appointments, and
                operational follow-ups from one secure dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm text-white/85">
              Har Zarurat Ka Sahi Margdarshan - Aapke saath, har kadam.
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex justify-center">
              <div className="relative h-16 w-[230px]">
                <Image
                  src="/brand/caresutra-hr-logo.svg"
                  alt="CareSutra"
                  fill
                  priority
                  sizes="230px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-semibold text-charcoal">
                Admin sign in
              </h2>
              <p className="mt-2 text-sm text-charcoal/65">
                Sign in to access the CareSutra dashboard.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className="rounded-xl border-soft-gold/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="rounded-xl border-soft-gold/50"
                />
              </div>

              {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-trust-blue py-6 font-semibold text-white hover:bg-support-blue"
              >
                {pending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal/60">
              <Link href="/" className="hover:text-trust-blue">
                Back to public website
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <LoginForm />
    </Suspense>
  )
}
