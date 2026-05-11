export default function MarqueeBar() {
  const text = "Sois authentique ✨ Livraison offerte sur ta première commande avec le code NNH26 ✨";

  return (
    <div className="overflow-hidden bg-[var(--color-deep-violet)] py-2 text-sm font-semibold text-white">
      <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-8 whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index}>{text}</span>
        ))}
      </div>
    </div>
  );
}
