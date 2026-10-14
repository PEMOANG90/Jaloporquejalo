"use client";

import { useState } from "react";

export default function JoinButton() {
  const [joined, setJoined] = useState(false);
  return (
    <button type="button" className={joined ? "btn btn-outline grow" : "btn btn-primary grow"} onClick={() => setJoined((j) => !j)} aria-pressed={joined}>
      {joined ? "Ya vas ✓" : "Me uno"}
    </button>
  );
}
