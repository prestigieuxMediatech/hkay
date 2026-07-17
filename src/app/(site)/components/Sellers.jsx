import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase'
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";// adjust path to match your project

async function Sellers() {

  const { data: products = [], error } = await supabase
    .from("products")
    .select("id,name,slug,images,price,status,is_best_seller")
    .eq("status", "active")
    .eq("is_best_seller", true)
    .limit(4);

  if (error) {
    console.error("Failed to load best sellers", error.message);
    return null;
  }

  return (
    <section className="px-6 py-12 md:px-10 md:py-16 lg:px-20">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 border-b pb-8 md:mb-12 md:flex-row md:items-center md:justify-between">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Best Sellers
          </h2>

          <p className="mt-3 text-base text-gray-600 md:text-lg">
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
            key={item.id}
            data-aos="fade-up"
            className="group overflow-hidden rounded-2xl border 
              bg-white p-0 py-0 gap-0 shadow-sm transition-all 
              duration-300 hover:-translate-y-1 hover:shadow-lg 
              flex flex-col"
          >
            <CardContent className="p-0 flex flex-col flex-1">

              {/* image links to product page */}
              <Link href={`/shop/${item.slug}`}>
                <div className="relative aspect-[4/5] w-full 
                  overflow-hidden bg-stone-100">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 
                        (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform 
                        duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center 
                      justify-center bg-stone-200">
                      <span className="text-sm font-medium 
                        text-stone-500">No image</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  {/* name links to product page */}
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-xl font-semibold 
                      text-gray-900 hover:underline">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-2xl font-bold text-black">
                    {"\u20B9"}{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Add to cart button — outside Link */}
                <div className="mt-5 cursor-pointer">
                  <AddToCartButton product={item} className='cursor-pointer'/>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Sellers;