import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg bg-accent text-accent-fg",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M5 6.5c3.2-1.4 5.5-.4 7 1.2 1.5-1.6 3.8-2.6 7-1.2V18c-3.2-1.2-5.5-.4-7 1.1-1.5-1.5-3.8-2.3-7-1.1V6.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 8v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
