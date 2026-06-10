"use client";

import { useEffect, useState } from "react";
import AOS from "aos";

import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

import Autoplay from "embla-carousel-autoplay";

export default function Hero() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: "/hero2.png",
      title: "New Season Collection",
      description:
        "Discover premium fashion, trending styles, and exclusive deals designed for every occasion.",
    },
    {
      image: "/hero3.png",
      title: "Summer Essentials",
      description:
        "Stay stylish and comfortable with our curated summer collection.",
    },
    {
      image: "/hero4.png",
      title: "Luxury Accessories",
      description:
        "Complete your look with premium accessories crafted for elegance.",
    },
  ];

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());

      setTimeout(() => {
        AOS.refreshHard();
      }, 100);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <section
              className="h-[650px] bg-cover bg-center flex items-center relative"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Content */}
              <div
                key={`${current}-${index}`}
                className="relative z-10 flex flex-col px-10 gap-8"
              >
                <h2
                  className="font-bold text-white text-6xl"
                  data-aos="fade-right"
                  data-aos-delay="300"
                  data-aos-once="false"
                >
                  {slide.title}
                </h2>

                <p
                  className="text-2xl text-white w-[500px]"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-once="false"
                >
                  {slide.description}
                </p>

                <div className="flex gap-5">
                  <Button
                    className="px-10 py-6 bg-black-500 text-white cursor-pointer text-lg hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
                    data-aos="fade-right"
                    data-aos-delay="700"
                    data-aos-once="false"
                  >
                    Shop Now
                  </Button>

                  <Button
                    className="px-10 py-6 bg-white cursor-pointer text-black text-lg hover:bg-black-500 hover:text-black hover:scale-105 transition-all duration-300"
                    data-aos="fade-left"
                    data-aos-delay="700"
                    data-aos-once="false"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}