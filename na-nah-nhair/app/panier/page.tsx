import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { cartTexts } from "@/content/site";

export const metadata: Metadata = { title: cartTexts.title, robots: { index: false } };

export default function CartPage() {
  return <CartView />;
}
