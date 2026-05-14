import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bellingham Performative Lesbian Contest",
  description: "Official scoring app — Elder Council Edition",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-gray-900 antialiased">{children}</body>
    </html>
  );
}
