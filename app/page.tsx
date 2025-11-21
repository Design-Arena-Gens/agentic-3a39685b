/* eslint-disable @next/next/no-img-element */
"use client";
import "./globals.css";
import { useState, useTransition } from "react";
import React from "react";

type Generation = {
  prompt: string;
  aspect: "3:4" | "4:3" | "1:1";
  imageUrl?: string;
  status?: "idle" | "generating" | "done" | "error";
  error?: string;
};

const PRESET_PROMPTS: Array<{ title: string; prompt: string }> = [
  {
    title: "Crispy Thigh + Tartar Splash",
    prompt:
      "Hyper-realistic hero shot of a fried chicken thigh in midair with thick tartar sauce bursting around it, flecks of capers, dill, and chopped pickles frozen in motion. The sauce flows like creamy waves, dancing around the crispy surface. Bright lemon-yellow background with moody studio backlight creates a gourmet, refreshing tone ultra-detailed commercial look, --ar 3:4"
  },
  {
    title: "Lux Thigh + Truffle Storm",
    prompt:
      "Hyper-realistic hero shot of a luxurious fried chicken thigh floating in the center, surrounded by a splash of creamy white truffle sauce, with shaved mushrooms and fine powder of porcini dusting the motion. Golden skin shines under cinematic key light, background in warm yellow-beige hues with soft haze premium gourmet commercial, --ar 3:4"
  }
];

export default function Page() {
  const [items, setItems] = useState<Generation[]>(
    PRESET_PROMPTS.map((p) => ({ prompt: p.prompt, aspect: "3:4", status: "idle" }))
  );
  const [isPending, startTransition] = useTransition();

  async function generate(index: number) {
    startTransition(async () => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "generating", error: undefined };
        return next;
      });
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: items[index].prompt,
            aspect: items[index].aspect
          })
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as { imageUrl: string };
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], imageUrl: data.imageUrl, status: "done" };
          return next;
        });
      } catch (err: any) {
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], status: "error", error: String(err?.message || err) };
          return next;
        });
      }
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950">
          Gourmet Chicken Hero Generator
        </h1>
        <p className="mt-3 text-zinc-700">
          Ultra-detailed, commercial-grade hero shots in warm lemon tones.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div className="card p-4" key={idx}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">
                {PRESET_PROMPTS[idx].title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => generate(idx)}
                  className="btn btn-primary"
                  disabled={item.status === "generating" || isPending}
                >
                  {item.status === "generating" ? "Generating?" : "Generate"}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.prompt);
                  }}
                  className="btn btn-ghost"
                >
                  Copy Prompt
                </button>
              </div>
            </div>

            <textarea
              className="mt-3 w-full rounded-xl border border-zinc-300 bg-white/80 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              rows={5}
              value={item.prompt}
              onChange={(e) => {
                const v = e.target.value;
                setItems((prev) => {
                  const next = [...prev];
                  next[idx] = { ...next[idx], prompt: v };
                  return next;
                });
              }}
            />

            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm text-zinc-700">Aspect</label>
              <select
                value={item.aspect}
                onChange={(e) => {
                  setItems((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], aspect: e.target.value as any };
                    return next;
                  });
                }}
                className="rounded-lg border border-zinc-300 bg-white/80 px-2 py-1 text-sm"
              >
                <option value="3:4">3:4</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
              </select>
            </div>

            <div className="mt-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt="Generated hero"
                  className="w-full rounded-xl border border-white/60 shadow-hero"
                />
              ) : (
                <div className="aspect-[3/4] w-full rounded-xl border border-dashed border-zinc-300 bg-white/50 grid place-items-center text-zinc-500">
                  No image yet
                </div>
              )}
              {item.status === "error" && (
                <p className="mt-2 text-sm text-red-600">Error: {item.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-sm text-zinc-600">
        Tip: Set OPENAI_API_KEY to generate with OpenAI. Without it, a placeholder will be used.
      </footer>
    </main>
  );
}

