import { metadata, viewport } from "next-sanity/studio";
import StudioClient from "./StudioClient";

export { metadata, viewport };
export const dynamic = "force-static";

export default function StudioPage() {
  return <StudioClient />;
}