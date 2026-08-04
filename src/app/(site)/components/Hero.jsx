"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { DEFAULT_HERO_SLIDES } from "@/lib/hero-slides";

export default function Hero() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_HERO_SLIDES);

  useEffect(() => {
    fetch("/api/hero-slides", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.slides) && data.slides.length) {
          setSlides(data.slides);
        }
      })
      .catch(() => {
        // The local defaults remain visible if the content service is unavailable.
      });
  }, []);

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
          <CarouselItem key={slide.id || index}>
            <section
              className="relative flex min-h-[420px] sm:min-h-[520px] lg:min-h-[650px] items-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image_url})`,
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
                    asChild
                    className="cursor-pointer bg-black px-8 py-5 text-base text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black sm:px-10 sm:py-6 sm:text-lg"
                    data-aos="fade-right"
                    data-aos-delay="700"
                    data-aos-once="false"
                  >
                    <Link href="/shop">Shop Now</Link>
                  </Button>

                  <Button
                    asChild
                    className="cursor-pointer bg-white px-8 py-5 text-base text-black transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white sm:px-10 sm:py-6 sm:text-lg"
                    data-aos="fade-left"
                    data-aos-delay="700"
                    data-aos-once="false"
                  >
                    <Link href="/contact">Contact Us</Link>
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
