import { productPage } from "@/content/site";

// Bouton présent dès maintenant ; le panier réel arrive en phase 5
export default function AddToCartButton({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <button
        type="button"
        disabled
        aria-describedby="panier-bientot"
        className="min-h-12 w-full cursor-not-allowed rounded-full bg-deep-violet px-8 py-3 text-sm font-bold uppercase tracking-wide text-white opacity-60 sm:w-auto"
      >
        {productPage.addToCart}
      </button>
      <p id="panier-bientot" className="mt-2 text-sm">
        {productPage.cartComingSoon}
      </p>
    </div>
  );
}
