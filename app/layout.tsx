import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AgentScript — AI Writing Assistant for Real Estate Agents",
    template: "%s | AgentScript",
  },
  description:
    "Generate professional listing descriptions, follow-up emails, offer letters, and social media captions in seconds. Built exclusively for real estate agents.",
  keywords: [
    "real estate AI",
    "listing description generator",
    "agent email templates",
    "real estate copywriting",
    "property listing AI",
    "real estate assistant",
  ],
  openGraph: {
    title: "AgentScript — AI Writing Assistant for Real Estate Agents",
    description:
      "Generate professional listing descriptions, emails, offer letters, and social posts in seconds.",
    type: "website",
    siteName: "AgentScript",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentScript — AI for Real Estate Agents",
    description: "Write every listing, email & offer letter — in seconds.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(38, 93%, 54%)",
          colorBackground: "hsl(222, 26%, 9%)",
          colorText: "hsl(210, 40%, 96%)",
          colorInputBackground: "hsl(222, 26%, 14%)",
          colorInputText: "hsl(210, 40%, 96%)",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
