import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/providers/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flashfinance-phi.vercel.app"),

  title: {
    default: "Flash Finance | Personal Finance Manager",
    template: "%s | FlashFinance",
  },

  description: "Take control of your money with FlashFinance. Track transactions, manage income and expenses, and analyze your monthly financial balance.",

  openGraph: {
    type: "website",
    url: "/",
    siteName: "FlashFinance",
    title: "FlashFinance | Take Control of Your Money",
    description: "Track your income, manage expenses, organize categories, and understand your financial health with FlashFinance.",
    images: [
      {
        url: "/og-image.png",
        alt: "FlashFinance — Personal Finance Management",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FlashFinance | Take Control of Your Money",
    description: "Track income, manage expenses, and monitor your financial health with FlashFinance.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
