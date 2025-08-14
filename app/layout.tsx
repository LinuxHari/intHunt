import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import env from "@/env";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inthunt",
  description: "Practice like it’s real. Improve fast. Succeed with confidence",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${monaSans.className} antialiased`}>
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          {modal}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
