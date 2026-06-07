import { redirect } from "next/navigation";
import { getRefNavigation } from "@/lib/reference";

export default function ReferencePage() {
  const nav = getRefNavigation();
  const firstSlug = nav[0]?.pages?.[0]?.slug;
  if (firstSlug) {
    redirect(`/reference/${firstSlug}`);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">API Reference</h1>
      <p className="mt-2 text-gray-500">Select an endpoint from the sidebar.</p>
    </div>
  );
}
