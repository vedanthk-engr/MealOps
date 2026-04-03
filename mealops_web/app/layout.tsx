import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MealOps • VIT Chennai Smart Mess",
  description: "Nutrition tracking and meal management ecosystem for VIT Chennai hostel students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#F5F3EE]`}>
        <Providers>
           {children}
           <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
