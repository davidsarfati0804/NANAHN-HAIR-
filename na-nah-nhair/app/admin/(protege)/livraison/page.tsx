import ShippingForm from "@/components/admin/ShippingForm";
import { adminTexts as t } from "@/content/site";
import { getSettings } from "@/lib/store";

export default async function AdminShippingPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="text-6xl text-deep-violet">{t.shipping.title}</h1>
      <ShippingForm settings={settings} />
    </div>
  );
}
