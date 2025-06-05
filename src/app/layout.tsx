import type { Metadata } from "next";
import { Poppins, Montserrat, Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PackIt - Virtual Closet and Packing Assistant",
  description: "Catalog your clothing items and get smart packing recommendations for your trips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} ${orbitron.variable} ${inter.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <footer className="bg-background-card border-t mt-auto py-6">
              <div className="container mx-auto px-6 text-center text-foreground text-sm">
                <p className="font-inter">&copy; {new Date().getFullYear()} <span className="font-orbitron">PackIt</span>. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
