import Header from "./components/Header";
import AOSProvider from "@/components/AOSProvider";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartContext";
import "aos/dist/aos.css";
import { ClerkProvider } from '@clerk/nextjs'

export default function SiteLayout({ children }) {
  return (
    <ClerkProvider>
      <CartProvider>
        <AOSProvider>
          <Header />
            {children}
          <Footer />
        </AOSProvider>
      </CartProvider>
    </ClerkProvider>
  );
}