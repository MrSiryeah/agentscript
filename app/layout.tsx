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
          colorPrimary: "#0d9488",          // teal-600
          colorBackground: "#ffffff",
          colorText: "#0f172a",
          colorInputBackground: "#f8fafc",
          colorInputText: "#0f172a",
          colorTextSecondary: "#64748b",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "shadow-md border border-slate-200 rounded-2xl",
          formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors",
          footerActionLink: "text-teal-600 hover:text-teal-700 font-semibold",
          headerTitle: "text-slate-900 font-bold",
          headerSubtitle: "text-slate-500",
          formFieldLabel: "text-slate-700 font-medium",
          formFieldInput: "border-slate-200 focus:border-teal-500 focus:ring-teal-500/30 rounded-lg bg-white",
          dividerLine: "bg-slate-200",
          dividerText: "text-slate-400",
          identityPreviewText: "text-slate-700",
          identityPreviewEditButton: "text-teal-600",
          socialButtonsIconButton: "border-slate-200 hover:bg-slate-50 rounded-xl",
          socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased bg-page`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
