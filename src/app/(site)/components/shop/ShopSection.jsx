"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase-client'
import Link from "next/link";
import AddToCartButton from "../AddToCartButton";

function ShopSection() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase
        .from("categories")
        .select("id,name")
        .order("created_at", { ascending: true });

      const { data: prods } = await supabase
        .from("products")
        .select("id,name,slug,price,images,category_id")
        .eq("status", "active");

      setCategories(cats || []);
      setProducts(prods || []);
    }

    fetchData();
  }, []);

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category_id === activeCategory);

  return (
    <section className="px-6 py-8 md:px-10 md:py-10 lg:px-20">

      <Card className="border shadow-sm mb-10">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex justify-stretch md:justify-end">
            <Input
              placeholder="Search products..."
              className="w-full md:w-[350px]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 border rounded-full text-sm 
                font-medium transition-all duration-300 cursor-pointer
                ${activeCategory === "all"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-black hover:text-white"
                }`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 border rounded-full text-sm 
                  font-medium transition-all duration-300 cursor-pointer
                  ${activeCategory === cat.id
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-black hover:text-white"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <p className="col-span-4 text-center text-gray-500 py-20">
            No products found.
          </p>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
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
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Add to cart button — outside Link */}
                  <div className="mt-5">
                    <AddToCartButton product={item} />
                  </div>
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}

export default ShopSection;