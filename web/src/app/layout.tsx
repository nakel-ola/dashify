import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Signika_Negative } from "next/font/google";
import "./globals.css";

const font = Signika_Negative({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-signika-negative",
});
export const metadata: Metadata = {
  title: { default: "Dashify", template: "%S | Dashify" },
  applicationName: "Dashify",
  description: "",
  authors: [{ name: "Nunu Olamilekan", url: "https://nakel.vercel.app/" }],
  creator: "Nunu Olamilekan",
  publisher: "Nunu Olamilekan",
  metadataBase: new URL(process.env.BASE_URL!),
  openGraph: {
    images: [
      {
        url: "/logo.png",
      },
    ],
    type: "website",
    siteName: "Dashify",
    url: "/",
    description: "",
  },
  robots: {
    index: false,
    follow: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: `${process.env.BASE_URL}/favicons/site.webmanifest`,
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "apple-mobile-web-app-title": "Dashify",
    "msapplication-TileColor": "#4f46e5",
    "msapplication-config": `${process.env.BASE_URL}/favicons/browserconfig.xml`,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.jpg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={"/favicons/apple-touch-icon.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={"/favicons/favicon-32x32.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={"/favicons/favicon-16x16.png"}
        />
        <link
          rel="mask-icon"
          href={"/favicons/safari-pinned-tab.svg"}
          color="#4f46e5"
        />
        <link rel="shortcut icon" href={"/favicons/favicon.ico"} />
      </head>
      <body className={cn(font.className, "flex flex-col justify-center")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
