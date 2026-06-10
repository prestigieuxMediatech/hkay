import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

function Story() {
  return (
    <section className="px-6 md:px-10 lg:px-20 py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-8 mb-12">
        <div data-aos="fade-right">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Story
          </h2>

          <p className="mt-3 text-gray-600 text-lg">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
          <h3 className="text-3xl font-semibold text-gray-900 mb-6">
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