import React from "react";
import { Hammer, ShieldCheck, Award } from "lucide-react";

function Values() {
  const values = [
    {
      title: "Craftsmanship",
      description:
        "Every piece is carefully handcrafted with precision, attention to detail, and a passion for timeless quality.",
      icon: Hammer,
    },
    {
      title: "Authenticity",
      description:
        "We use genuine leather and premium materials to ensure every product reflects true quality and character.",
      icon: ShieldCheck,
    },
    {
      title: "Durability",
      description:
        "Built to withstand everyday use, our products are designed to age beautifully and last for years.",
      icon: Award,
    },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-20 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-bold text-gray-900"
          data-aos="fade-up"
        >
          Our Values
        </h2>

        <p
          className="mt-3 text-lg text-gray-600"
          data-aos="fade-up"
        >
          The principles that guide every product we create.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <div
              key={value.title}
              data-aos="fade-up"
              className="
                border
                rounded-2xl
                p-8
                text-center
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
              "
            >
              <div className="flex justify-center mb-5">
                <Icon size={36} />
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Values;