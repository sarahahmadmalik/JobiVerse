"use client";

import { Poppins, Inter } from "next/font/google";
import { OnboardingProvider } from "@/contexts/OnboardingContext/OnboardingContext";
import { metadata } from "@/app/layout.server";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-small.png" sizes="any" type="image/png" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <OnboardingProvider>{children}</OnboardingProvider>
      </body>
    </html>
  );
}
