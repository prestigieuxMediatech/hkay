import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function Filters() {
  const filters = [
    "All",
    "Wallets",
    "Card Holders",
    "Watch Straps",
    "Keychains",
    "Pen Cases",
    "Laptop Sleeves",
    "Mobile Holsters",
  ];

  return (
    <section className="px-6 py-8 md:px-10 md:py-10 lg:px-20">
      <Card className="border shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Search */}
          <div className="mb-6 flex justify-stretch md:justify-end">
            <Input
              placeholder="Search products..."
              className="w-full md:w-[350px]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => (
              <button
                key={index}
                className="
                  px-5
                  py-2
                  border
                  rounded-full
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-black
                  hover:text-white
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                {filter}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Filters;
