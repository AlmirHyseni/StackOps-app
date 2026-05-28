"use client";

import React from "react";

export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="4" strokeOpacity="0.15" />
      <path d="M22 12a10 10 0 00-10-10" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
