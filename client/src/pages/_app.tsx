import { Toaster } from "@/components/ui/toaster";
import truncate from "@/lib/truncate";
import "@/styles/globals.css";
import "@/styles/project-theme.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Signika_Negative } from "next/font/google";
import Head from "next/head";
import { Fragment } from "react";
import { AuthContext } from "../components/AuthContext";

const font = Signika_Negative({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-signika-negative",
});

export const metadata = {
  title: "Dashify",
  description: "",
  keywords: "",
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <Fragment>
      <Head>
        <meta name="title" content={`Dashify | ${process.env.BASE_URL}`} />
        <link rel="icon" href="/logo.jpg" />

        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.BASE_URL}${router.pathname}`}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:description"
          property="og:description"
          content={truncate(metadata.description, 100)}
        />
        <meta
          key="og:image"
          property="og:image"
          content={`${process.env.BASE_URL}/logo.png`}
        />

        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content="nakel.ola" />
        <meta name="publisher" content="nakel.ola" />

        <meta
          name="description"
          content={truncate(metadata.description, 100)}
        ></meta>

        <link rel="canonical" href={process.env.BASE_URL} />
        <meta name="robots" content="INDEX,FOLLOW"></meta>
        <meta property="og:title" content="Martvest" />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:URL" content={process.env.BASE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="dashify-theme"
      >
        <SessionProvider session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <div className={font.className}>
              <Component {...pageProps} />
              <Toaster />
              <AuthContext />
            </div>
            {/* <ReactQueryDevtools /> */}
          </QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </Fragment>
  );
}
