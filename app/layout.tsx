import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const Montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat-Arabic-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat-Arabic-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    // Add other weights and styles if needed
  ],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "كارت معايدة",
  description: "كارت معايدة لجميع المناسبات الرسمية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
