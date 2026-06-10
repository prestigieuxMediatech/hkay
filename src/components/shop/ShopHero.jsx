import React from 'react'

function ShopHero() {
  return (
    <section
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/shop.png')" }}
        >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

        {/* Content */}
        <div className="relative mt-20 z-10 px-20 text-white flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold mb-4">
                Explore Our Collection
            </h2>

            <p className="text-lg">
                Discover premium handcrafted leather bags, wallets, belts, and accessories designed to elevate your everyday style.
            </p>
        </div>
    </section>
  )
}

export default ShopHero
