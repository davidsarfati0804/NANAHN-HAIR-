import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import { CartProvider } from "@/components/cart/CartProvider";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brand } from "@/content/site";
import "./globals.css";

// Polices du premier site, en attendant celles des flacons
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const montserrat = Montserrat({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${brand.name} | ${brand.signature}`, template: `%s | ${brand.name}` },
  description: "Trois soins. Trois personnalités. Une seule question : lequel est le tien ?",
  openGraph: { siteName: brand.name, type: "website", locale: "fr_FR" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${bebas.variable} ${montserrat.variable}`}>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="contenu">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
