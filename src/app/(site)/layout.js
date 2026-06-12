import Header from "@/components/Header";
import AOSProvider from "@/components/AOSProvider";
import Footer from "@/components/Footer";
import "aos/dist/aos.css";

export default function SiteLayout({ children }) {
  return (
    <AOSProvider>
      <Header />
      {children}
      <Footer />
    </AOSProvider>
  );
}
