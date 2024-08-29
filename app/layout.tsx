import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

// const ORIGIN_URL =
//   process.env.NODE === "production"
//     ? "https://todovex.ai"
//     : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Todai",
  description:
    "Todai seamlessly organizes your tasks and predicts what's next using AI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={defaultFont.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
