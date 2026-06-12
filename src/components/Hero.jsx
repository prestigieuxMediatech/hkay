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
              className="relative flex min-h-[420px] sm:min-h-[520px] lg:min-h-[650px] items-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Content */}
              <div
                key={`${current}-${index}`}
                className="relative z-10 flex flex-col gap-5 px-6 sm:gap-6 sm:px-10 md:gap-8"
              >
                <h2
                  className="max-w-xl text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"
                  data-aos="fade-right"
                  data-aos-delay="300"
                  data-aos-once="false"
                >
                  {slide.title}
                </h2>

                <p
                  className="max-w-md text-base text-white sm:max-w-lg sm:text-lg md:text-xl lg:text-2xl"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-once="false"
                >
                  {slide.description}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                  <Button
                    className="cursor-pointer bg-black px-8 py-5 text-base text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black sm:px-10 sm:py-6 sm:text-lg"
                    data-aos="fade-right"
                    data-aos-delay="700"
                    data-aos-once="false"
                  >
                    Shop Now
                  </Button>

                  <Button
                    className="cursor-pointer bg-white px-8 py-5 text-base text-black transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white sm:px-10 sm:py-6 sm:text-lg"
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