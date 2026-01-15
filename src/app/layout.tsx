import { Box, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import { Noto_Sans_JP, Roboto } from "next/font/google";
import theme from "@/theme";
import Footer from "@/components/layout/footer";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ito抽選機アプリ",
  description: "ito抽選機アプリ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${roboto.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box minHeight="100dvh" display="flex" flexDirection="column">
              <Box component="main" flexGrow={1}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
