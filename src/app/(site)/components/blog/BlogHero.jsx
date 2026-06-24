import React from 'react'

function BlogHero() {
  return (
    <section
      className="relative flex min-h-[320px] items-center justify-center bg-cover bg-center sm:min-h-[400px] lg:min-h-[460px]"
      style={{ backgroundImage: "url('/story.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />

      <div className="relative z-10 mx-auto mt-16 flex max-w-4xl flex-col items-center px-6 pt-8 text-center text-white sm:mt-20 sm:px-10 md:px-16 lg:px-20">
        <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm sm:mb-5">
          HKAY Journal
        </span>

        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Insights & Stories
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
          Explore leather care tips, craftsmanship insights, style inspiration, and the stories behind our products.
        </p>
      </div>
    </section>
  )
}

export default BlogHero
