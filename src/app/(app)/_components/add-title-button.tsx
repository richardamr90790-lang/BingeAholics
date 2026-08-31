"use client";

import { useState } from "react";
import { AddTitleDialog } from "./add-title-dialog";
import { PlusIcon } from "./icons";

export function AddTitleButton({
  label = "Add title",
  variant = "solid",
}: {
  label?: string;
  variant?: "solid" | "ghost";
}) {
  const [open, setOpen] = useState(false);

  const cls =
    variant === "solid"
      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500"
      : "border border-white/15 text-zinc-200 hover:bg-white/5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${cls}`}
      >
        <PlusIcon className="size-4" />
        {label}
      </button>
      <AddTitleDialog
        key={open ? "open" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
