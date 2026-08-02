import { Inter } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider";
import StoreProvider from "@/redux/StoreProvider";
import MotionProvider from "@/components/motion/MotionProvider";
import NavigationSetter from "@/components/common/NavigationSetter";
import Navigation from "@/components/navigation/Navigation";
import PageTransition from "@/components/motion/PageTransition";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/index.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MyNextDuty",
  description: "Find your next duty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <StoreProvider>
            <MotionProvider>
              <NavigationSetter />
              <header>
                <Navigation />
              </header>
              <main>
                <PageTransition>{children}</PageTransition>
              </main>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                toastClassName="!bg-card !text-text-primary !shadow-medium !rounded-card !border !border-border"
                bodyClassName="!text-sm !font-sans"
              />
            </MotionProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
