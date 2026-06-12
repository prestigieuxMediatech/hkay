import React from "react";

function Numbers() {
  const stats = [
    {
      number: "7+",
      label: "Years of Craftsmanship",
    },
    {
      number: "12,000+",
      label: "Orders Delivered",
    },
    {
      number: "4.9★",
      label: "Customer Rating",
    },
    {
      number: "100%",
      label: "Genuine Leather",
    },
  ];

  return (
    <section className="px-6 py-12 md:px-10 md:py-16 lg:px-20">
      {/* Header */}
      <div className="mb-10 text-center md:mb-12">
        <h2
          className="text-3xl font-bold text-gray-900 md:text-4xl"
          data-aos="fade-up"
        >
          By The Numbers
        </h2>

        <p
          className="mt-3 text-base text-gray-600 md:text-lg"
          data-aos="fade-up"
        >
          A reflection of our commitment to quality, trust, and craftsmanship.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            data-aos="fade-up"
            className="
              rounded-2xl
              border
              p-4
              sm:p-6
              text-center
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
            "
          >
            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              {item.number}
            </h3>

            <p className="mt-2 text-gray-600">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Numbers;