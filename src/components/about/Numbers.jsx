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
    <section className="px-6 md:px-10 lg:px-20 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-bold text-gray-900"
          data-aos="fade-up"
        >
          By The Numbers
        </h2>

        <p
          className="mt-3 text-lg text-gray-600"
          data-aos="fade-up"
        >
          A reflection of our commitment to quality, trust, and craftsmanship.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            data-aos="fade-up"
            className="
              rounded-2xl
              border
              p-6
              text-center
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
            "
          >
            <h3 className="text-4xl font-bold text-gray-900">
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