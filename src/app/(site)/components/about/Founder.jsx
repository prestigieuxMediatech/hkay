import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

function Founder() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20">
      <Card className="border shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Image */}
            <div data-aos="fade-right">
              <Image
                src="/founder.png"
                alt="Founder"
                width={600}
                height={450}
                className="h-[280px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[450px]"
              />
            </div>

            {/* Content */}
            <div data-aos="fade-left">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
                How It All Began
              </h3>

              <p className="text-gray-600 leading-8 mb-5">
                What began as a passion for fine craftsmanship soon became a
                mission to create leather goods that stand the test of time.
              </p>

              <p className="text-gray-600 leading-8 mb-5">
                At HKAY, we focus on quality over quantity, blending
                traditional techniques with modern design to craft products
                that are elegant, durable, and made to accompany you on every
                journey.
              </p>

              <p className="text-gray-600 leading-8">
                Every stitch, every cut, and every detail reflects our
                commitment to creating products that age beautifully and serve
                their owners for years to come.
              </p>

              <div className="mt-8 pt-6 border-t">
                <p className="font-semibold text-gray-900">
                  HKAY Leather Goods
                </p>

                <p className="text-gray-500">
                  Crafting Excellence Since 2018
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Founder;
