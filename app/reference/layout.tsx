import { getRefNavigation } from "@/lib/reference";
import ReferenceSidebar from "@/components/ReferenceSidebar";

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getRefNavigation();

  return (
    <div className="flex" id="content">
      <ReferenceSidebar navigation={navigation} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
