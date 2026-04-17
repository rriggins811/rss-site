import { RYAN_EMAIL } from "@/lib/contact";

type Props = {
  className?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
};

/**
 * Small, muted email-fallback line rendered below any "Book a Call" CTA.
 * Copy is fixed: Ryan wants the exact wording and mailto: link consistent.
 * Use variant="dark" on navy/burgundy backgrounds.
 */
export function EmailFallback({
  className = "",
  align = "left",
  variant = "light",
}: Props) {
  const alignClass = align === "center" ? "text-center" : "";
  const textClass =
    variant === "dark" ? "text-cream/70" : "text-ink/60";
  const linkClass =
    variant === "dark"
      ? "text-gold-300 hover:text-gold-100"
      : "text-burgundy-600 hover:text-burgundy-700";

  return (
    <p className={`text-sm leading-relaxed ${textClass} ${alignClass} ${className}`}>
      Not comfortable with a call? Just want to shoot me an email? Reach me at{" "}
      <a
        href={`mailto:${RYAN_EMAIL}`}
        className={`underline underline-offset-2 ${linkClass}`}
      >
        {RYAN_EMAIL}
      </a>
    </p>
  );
}
