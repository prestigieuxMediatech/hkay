import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Sellers() {
  const products = [
    {
      name: "Leather Travel Bag",
      image: "/Bags.png",
      price: "₹4,999",
    },
    {
      name: "Leather Wallet",
      image: "/Wallets.png",
      price: "₹1,499",
    },
    {
      name: "Leather Belt",
      image: "/Belts.png",
      price: "₹1,299",
    },
    {
      name: "Leather Watch Strap",
      image: "/Straps.png",
      price: "₹999",
    },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-20 py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-8 mb-12">
        <div data-aos="fade-right">
          <h2 className="text-4xl font-bold text-gray-900">
            Best Sellers
          </h2>

          <p className="mt-3 text-gray-600 text-lg">
            Handpicked leather essentials crafted for everyday elegance.
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
          Explore Products
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <Card
            key={item.name}
            data-aos="fade-up"
            className="
              overflow-hidden
              rounded-2xl
              border
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={500}
                  className="
                    w-full
                    h-[320px]
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-105
                  "
                />
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-2xl font-bold text-black">
                  {item.price}
                </p>

                <Button
                  className="
                    w-full
                    mt-5
                    py-5
                    rounded-lg
                    bg-black
                    text-white
                    hover:bg-gray-900
                  "
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Sellers;