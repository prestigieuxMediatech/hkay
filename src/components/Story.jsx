import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

function Story() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 border-b pb-8 md:mb-12 md:flex-row md:items-center md:justify-between">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Our Story
          </h2>

          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Crafting timeless leather goods with passion, precision, and purpose.
          </p>
        </div>

        <Button
          data-aos="fade-left"
          className="
            px-8
            py-6
            rounded-xl
            bg-black
            text-white
            text-base
            hover:scale-105
            transition-all
            duration-300
          "
        >
          About Us
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div data-aos="fade-right">
          <Image
            src="/story.png"
            alt="Our Story"
            width={700}
            height={500}
            className="w-full rounded-2xl shadow-md"
          />
        </div>

        {/* Text */}
        <div data-aos="fade-left">
          <h3 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl">
            Built on Craftsmanship & Quality
          </h3>

          <div className="space-y-5 text-gray-600 leading-8">
            <p>
              At HKAY, we believe that exceptional products begin with
              exceptional craftsmanship. Our journey started with a simple
              vision—to create premium leather goods that combine timeless
              design, durability, and everyday functionality.
            </p>

            <p>
              Every bag, wallet, belt, and watch strap is thoughtfully crafted
              using carefully selected materials and meticulous attention to
              detail. We take pride in preserving the artistry of traditional
              leather craftsmanship while embracing modern designs for today's
              lifestyle.
            </p>

            <p>
              More than just accessories, our products are designed to accompany
              you through life's journeys, growing richer in character with
              every use and becoming a lasting part of your story.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Story;