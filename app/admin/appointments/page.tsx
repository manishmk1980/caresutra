"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { formatDateOnly } from "@/lib/formatDateTime";

type AppointmentRow = {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string | null;
  telegram: string | null;
  city: string | null;
  serviceInterest: string;
  preferredContactMethod: string;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  message: string | null;
  consentAccepted: boolean;
  status: "NEW" | "CONTACTED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

const STATUS_OPTIONS: AppointmentRow["status"][] = [
  "NEW",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout("/api/appointments");
      const payload = (await res.json().catch(() => null)) as { success?: boolean; requests?: AppointmentRow[]; message?: string } | null;
      if (res.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!res.ok || !payload?.success || !Array.isArray(payload.requests)) {
        setError(payload?.message || "Unable to load appointment requests.");
        setRows([]);
        return;
      }
      setRows(payload.requests);
    } catch {
      setError("Unable to load appointment requests.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  async function updateStatus(id: number, status: AppointmentRow["status"]) {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetchWithTimeout(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setError("Unable to update appointment status.");
        return;
      }
      await loadData();
    } catch {
      setError("Unable to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-ivory px-4 pb-12 pt-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-charcoal">Appointment Requests</h1>
            <p className="mt-1 text-charcoal/70">View and manage appointment requests submitted from the public website.</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-soft-gold/50">
            <Link href="/admin/activity">Back to Customer Records</Link>
          </Button>
        </div>

        <Card className="overflow-hidden rounded-3xl border-soft-gold/35 bg-white shadow-sm">
          <CardHeader className="border-b border-soft-gold/20 bg-gradient-to-r from-trust-blue/5 to-support-blue/5">
            <CardTitle className="text-charcoal">Incoming requests</CardTitle>
            <CardDescription>Latest first. Update status as you contact and schedule requests.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-sm text-charcoal/70">Loading appointment requests...</div>
            ) : error ? (
              <div className="p-8 text-sm text-red-700">{error}</div>
            ) : rows.length === 0 ? (
              <div className="p-8 text-sm text-charcoal/70">No appointment requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1400px] w-full border-collapse">
                  <thead>
                    <tr className="bg-ivory text-left text-sm text-charcoal">
                      <th className="px-4 py-3 font-semibold">Full Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Mobile</th>
                      <th className="px-4 py-3 font-semibold">WhatsApp</th>
                      <th className="px-4 py-3 font-semibold">Telegram</th>
                      <th className="px-4 py-3 font-semibold">Service Interest</th>
                      <th className="px-4 py-3 font-semibold">Preferred Contact</th>
                      <th className="px-4 py-3 font-semibold">Preferred Date</th>
                      <th className="px-4 py-3 font-semibold">Time Slot</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-t border-soft-gold/20 text-sm text-charcoal/85 odd:bg-white even:bg-ivory/20">
                        <td className="px-4 py-3 align-top">{row.fullName}</td>
                        <td className="px-4 py-3 align-top">{row.email}</td>
                        <td className="px-4 py-3 align-top">{row.mobile}</td>
                        <td className="px-4 py-3 align-top">{row.whatsapp || "—"}</td>
                        <td className="px-4 py-3 align-top">{row.telegram || "—"}</td>
                        <td className="px-4 py-3 align-top">{row.serviceInterest}</td>
                        <td className="px-4 py-3 align-top">{row.preferredContactMethod}</td>
                        <td className="px-4 py-3 align-top">{formatDateOnly(row.preferredDate)}</td>
                        <td className="px-4 py-3 align-top">{row.preferredTimeSlot || "—"}</td>
                        <td className="px-4 py-3 align-top">{row.status}</td>
                        <td className="px-4 py-3 align-top">{formatDateOnly(row.createdAt)}</td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((status) => (
                              <Button
                                key={status}
                                type="button"
                                size="sm"
                                variant={status === row.status ? "default" : "outline"}
                                className={status === row.status ? "bg-trust-blue text-white hover:bg-support-blue" : "border-soft-gold/40"}
                                disabled={updatingId === row.id}
                                onClick={() => void updateStatus(row.id, status)}
                              >
                                {status}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
