import type { Metadata } from "next";
import AppProviders from "@/providers/app-providers";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "next-template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
