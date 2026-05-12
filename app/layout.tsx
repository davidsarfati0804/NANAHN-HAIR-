import type { Metadata } from "next";
import CartDrawer from "@/components/ecommerce/CartDrawer";
import { CartProvider } from "@/components/ecommerce/CartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Na Nah N’hair | Sérums capillaires",
    template: "%s | Na Nah N’hair",
  },
  description:
    "Sérums capillaires Na Nah N’hair : une routine cheveux clean, fun et premium accessible.",
  openGraph: {
    siteName: "Na Nah N’hair",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
