import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/space-grotesk/700.css";
import HawksightThemeProvider from "@/theme";
import HawksightClientProvider from "@/components/solana/solana-provider";

export const metadata: Metadata = {
  title: "HawkFi Dev Exam",
  description: "HawkFi Dev Exam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HawksightThemeProvider>
          <HawksightClientProvider>{children}</HawksightClientProvider>
        </HawksightThemeProvider>
      </body>
    </html>
  );
}
