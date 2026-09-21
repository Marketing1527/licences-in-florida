import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Licenses in Florida Admin",
  description: "Licensing, compliance, inspections, and credentialing operations console",
  metadataBase: new URL("https://licencesinflorida.com"),
  icons: {
    icon: [{ url: "/admin/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/admin/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Licenses in Florida Admin",
    description: "Licensing operations console",
    url: "https://licencesinflorida.com/admin/login",
    siteName: "Licenses in Florida",
    images: [{ url: "/admin/og-image.png", width: 1200, height: 630, alt: "Licenses in Florida" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/admin/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
