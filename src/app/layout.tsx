import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/site/JsonLd";
import { Analytics } from "@/components/site/Analytics";
import { AnalyticsClickTracker } from "@/components/site/AnalyticsClickTracker";
import { MetaPixel } from "@/components/site/MetaPixel";
import { organizationSchema, personSchema, websiteSchema } from "@/lib/schema";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Senior Transition Advisor`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Senior Transition Advisor`,
    description: SITE_DESCRIPTION,
    images: [
      {
        // Optimized canonical brand portrait hosted at /brand/. Same
        // image URL referenced by Person + ProfessionalService schemas
        // — single source for the entity graph + social card preview.
        url: "/brand/ryan-headshot.jpg",
        width: 1200,
        height: 670,
        alt: "Ryan Riggins, Senior Transition Advisor, Riggins Strategic Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Senior Transition Advisor`,
    description: SITE_DESCRIPTION,
    images: ["/brand/ryan-headshot.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Facebook domain verification — required so the "info" link on
  // Meta ads (and the rendered link preview in any FB/IG ad) resolves
  // to rigginsstrategicsolutions.com instead of Meta's fallback page.
  // Verified token from Business Manager → Brand Safety → Domains.
  other: {
    "facebook-domain-verification": "xkpw2bv5hkepkglqcn1l78d9x0qbsa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Analytics />
        <AnalyticsClickTracker />
        <MetaPixel />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
