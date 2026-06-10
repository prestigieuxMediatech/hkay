import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Clock3,
  Headphones,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

function Features() {
  const features = [
    {
      title: "Reply Within 24 Hours",
      description:
        "Our team responds to all inquiries promptly to ensure you receive the assistance you need.",
      icon: Clock3,
    },
    {
      title: "Dedicated Support",
      description:
        "Get personalized assistance for products, orders, and any questions you may have.",
      icon: Headphones,
    },
    {
      title: "Secure Communication",
      description:
        "Your information is handled with care and all communications remain secure and confidential.",
      icon: ShieldCheck,
    },
    {
      title: "Customized Orders",
      description:
        "Looking for something unique? We offer personalized solutions tailored to your requirements.",
      icon: PackageCheck,
    },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-20 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-bold text-gray-900"
          data-aos="fade-up"
        >
          We're Here to Help
        </h2>

        <p
          className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          Get reliable support, quick responses, and personalized assistance
          from our team.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              data-aos="fade-up"
              className="
                border
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
              "
            >
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-5">
                  <Icon size={36} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default Features;