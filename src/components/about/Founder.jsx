import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";

function Founder() {
  return (
    <section className="px-6 md:px-10 lg:px-20 py-20">
      <Card className="border shadow-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <div data-aos="fade-right">
              <Image
                src="/founder.png"
                alt="Founder"
                width={600}
                height={450}
                className="w-full h-[450px] rounded-2xl object-cover"
              />
            </div>

            {/* Content */}
            <div data-aos="fade-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
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