import type { Metadata } from "next";
import Checkout from "@/components/cart/Checkout";
import { checkoutTexts } from "@/content/site";

export const metadata: Metadata = { title: checkoutTexts.title, robots: { index: false } };

export default function CheckoutPage() {
  return <Checkout />;
}
