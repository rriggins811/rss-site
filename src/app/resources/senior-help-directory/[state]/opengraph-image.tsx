import { stateBySlug } from "@/lib/directory";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "State senior help directory";

export default async function OGImage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const name = stateBySlug(state)?.name;
  const title = name ? `${name} Senior Help Directory` : "Senior Help Directory";
  return renderOgImage({ title, eyebrow: "Senior Help Directory", footerNote: "Local senior aid by county" });
}
