import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
import Sellers from "@/components/Sellers";
import Story from "@/components/Story";

export default function Home() {
  return(
    <div className="home">
      <Hero/>
      <Categories/>
      <Sellers/>
      <Story/>
      <Reviews/>
      <CTA/>
    </div>
  )
}
