import { getMedia } from "@/lib/store";

export const dynamic = "force-dynamic";

// Photos envoyées depuis le back-office
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[a-z0-9-]{1,80}$/.test(key)) return new Response("Introuvable", { status: 404 });
  const media = await getMedia(key);
  if (!media) return new Response("Introuvable", { status: 404 });
  return new Response(media.data, {
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
