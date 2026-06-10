import Image from "next/image";
import React from "react";

function Process() {
  const steps = [
    {
      step: "01",
      title: "Premium Leather Selection",
      image: "/process1.png",
      description:
        "We begin by sourcing top-grade genuine leather chosen for its durability, texture, and character.",
    },
    {
      step: "02",
      title: "Precision Cutting",
      image: "/process2.png",
      description:
        "Each pattern is carefully measured and hand-cut to ensure accuracy and minimal material waste.",
    },
    {
      step: "03",
      title: "Expert Craftsmanship",
      image: "/process3.png",
      description:
        "Skilled artisans assemble every piece with meticulous attention to detail and finishing.",
    },
    {
      step: "04",
      title: "Quality Inspection",
      image: "/process4.png",
      description:
        "Every product undergoes a thorough quality check before it reaches our customers.",
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
          How It's Made
        </h2>

        <p
          className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          From carefully selected leather to the final stitch, every step
          reflects our commitment to quality and craftsmanship.
        </p>
      </div>

      {/* Process Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item) => (
          <div
            key={item.step}
            data-aos="fade-up"
            className="
              border
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
              bg-white
            "
          >
            {/* Step Number */}
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              {item.step}
            </h3>

            {/* Image */}
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={220}
              className="w-full h-[180px] object-cover rounded-xl"
            />

            {/* Content */}
            <div className="mt-5 text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h4>

              <p className="text-gray-600 leading-7">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Process;