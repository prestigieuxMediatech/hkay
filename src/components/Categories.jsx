import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Categories() {
  const categories = [
    {
      name: "Bags",
      image: "/Bags.png",
    },
    {
      name: "Wallets",
      image: "/Wallets.png",
    },
    {
      name: "Belts",
      image: "/Belts.png",
    },
    {
      name: "Watch Straps",
      image: "/Straps.png",
    },
  ];

  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 border-b pb-8 md:mb-12 md:flex-row md:items-center md:justify-between">
        <div data-aos='fade-right'>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Categories
          </h2>

          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Discover our premium handcrafted leather collection
          </p>
        </div>

        <Button
          className="
            px-8
            py-6
            rounded-xl
            bg-black
            text-white
            text-base
            cursor-pointer
            hover:scale-105
            transition-all
            duration-300
          "
          data-aos='fade-left'
        >
          Explore Categories
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((item) => (
          <Card
            key={item.name}
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-100 
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              cursor-pointer
            "
            data-aos='fade-down'
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={500}
                  className="
                    w-full
                    h-[260px]
                    sm:h-[300px]
                    lg:h-[360px]
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-105
                  "
                />

                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Category Name */}
                <div className="absolute bottom-6 left-0 w-full">
                  <h3 className="text-center text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Categories;