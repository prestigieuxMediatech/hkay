import React from 'react'

function AboutHero() {
  return (
    <section
        className="relative h-[450px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('/about.png')" }}
        >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

        {/* Content */}
        <div className="relative mt-20 z-10 px-20 text-white flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold mb-4">
                The Story Behind Every Stitch
            </h2>

            <p className="text-lg">
                Since 2018, HKAY has been dedicated to creating premium leather goods
                that combine timeless craftsmanship, exceptional quality, and modern
                design.
            </p>
        </div>
    </section>
  )
}

export default AboutHero