"use client";

import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

const empty: FormState = { firstName: "", lastName: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("success");
      setForm(empty);
    } else {
      const body = await res.json().catch(() => ({}));
      const first = Object.values(body.error ?? {})[0];
      setErrorMsg(Array.isArray(first) ? first[0] : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-800">Message sent!</p>
        <p className="mt-1 text-sm text-emerald-700">We will get back to you as soon as possible.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-emerald-700 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="input-base"
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
          required
        />
        <input
          className="input-base"
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => setField("lastName", e.target.value)}
          required
        />
      </div>
      <input
        type="email"
        className="input-base"
        placeholder="Email address"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        required
      />
      <input
        className="input-base"
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setField("subject", e.target.value)}
        required
      />
      <textarea
        className="input-base min-h-32"
        placeholder="Message"
        value={form.message}
        onChange={(e) => setField("message", e.target.value)}
        required
        minLength={10}
      />
      {status === "error" ? (
        <p className="text-sm text-red-600">{errorMsg}</p>
      ) : null}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
