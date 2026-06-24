import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ShopProducts() {
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
    <section className="px-6 py-12 md:px-10 md:py-16 lg:px-20">
      {/* Header */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <Card
            key={item.name}
            data-aos="fade-up"
            className="group overflow-hidden rounded-2xl border bg-white p-0 py-0 gap-0 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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

export default ShopProducts;
