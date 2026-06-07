import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CommentaryProvider and CommentaryTour live at the root layout so a
  // running tour survives cross-section navigation. This layout just
  // provides the Guides sidebar.
  return (
    <div className="flex" id="content">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <MobileSidebar />
        {children}
      </div>
    </div>
  );
}
