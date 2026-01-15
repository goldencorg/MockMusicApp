import type { Metadata } from "next";
import { MSWProvider } from "@/components/MSWProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Music App",
  description: "A playlist app with mocked data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {}
        <MSWProvider>
          {children}
        </MSWProvider>
      </body>
    </html>
  );
}