import { socialLinks } from "@/lib/social";

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

export function SocialLinks({ className = "", iconClassName = "h-5 w-5" }: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {socialLinks.map((link) => (
        <li key={link.name}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-current transition-colors hover:text-gold-500 focus-visible:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={iconClassName}
            >
              <path d={link.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
