import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import { CartProvider } from "@/components/cart/CartProvider";
import ConsentBanner from "@/components/consent/ConsentBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brand, pack, seo } from "@/content/site";
import { isIndexable, siteUrl } from "@/lib/site-url";
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
  metadataBase: new URL(siteUrl()),
  robots: isIndexable() ? undefined : { index: false, follow: false },
  title: { default: `${brand.name} | ${brand.signature}`, template: `%s | ${brand.name}` },
  description: seo.description,
  // Image de partage par défaut (accueil et pages sans image propre) : la photo du pack des trois soins
  openGraph: {
    siteName: brand.name,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/images/produits/pack-1200.jpg", width: 1200, height: 1500, alt: pack.photo.alt }],
  },
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
          <ConsentBanner />
        </CartProvider>
      </body>
    </html>
  );
}
