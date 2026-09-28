'use client'

import { useEffect, useState } from "react";

const words = ["Dia 33", "Next.js"];
const WORD_DURATION = 1000;
const STORAGE_KEY = "launch-played";

let started = false;

export default function Launch() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (started) return;
    started = true;

    if (sessionStorage.getItem(STORAGE_KEY)) return;

    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(true), 0);

    words.forEach((_, i) => setTimeout(() => setIndex(i), i * WORD_DURATION));
    setTimeout(() => setVisible(false), words.length * WORD_DURATION);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <h1
        key={index}
        className="animate-[launch-word_0.6s_ease-out] text-5xl font-bold text-white"
      >
        {words[index]}
      </h1>
    </div>
  );
}