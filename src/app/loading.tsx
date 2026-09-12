"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#071322] text-white">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="absolute w-16 h-16 rounded-full bg-sky-500/20 animate-ping" />
        {/* Spinning indicator ring */}
        <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
        {/* Center dot */}
        <div className="absolute w-3 h-3 rounded-full bg-sky-400 shadow-lg shadow-sky-500/50" />
      </div>
      <p className="mt-4 text-xs font-medium tracking-wider text-slate-400 uppercase animate-pulse">
        Hari Om Thalassic
      </p>
    </div>
  );
}
