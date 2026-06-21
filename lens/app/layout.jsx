import StoreProvider from "@/redux/StoreProvider";
import NavigationSetter from "@/components/common/NavigationSetter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/index.css";

export const metadata = {
  title: "MyNextDuty",
  description: "Find your next duty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreProvider>
          <NavigationSetter />
          {children}
          <ToastContainer position="top-right" autoClose={5000} />
        </StoreProvider>
      </body>
    </html>
  );
}
