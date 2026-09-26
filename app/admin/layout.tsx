import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel · Mishón",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-crema text-negro">{children}</div>;
}
