import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Curtain Rises – A Celebration of Love",
  description:
    "An intimate, cinematic wedding experience in Charleston, South Carolina. The curtain rises on August 8, 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stage-black text-ivory antialiased">
        <div className="bg-stage-gradient min-h-screen">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,249,235,0.24),_transparent_60%)]" />
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.75),_transparent_55%)]" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
