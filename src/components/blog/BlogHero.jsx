import React from 'react'

function BlogHero() {
  return (
    <section
      className="relative flex min-h-[460px] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/story.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-white md:px-10 lg:px-20">
        <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
          HKAY Journal
        </span>

        <h2 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
          Insights & Stories
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          Explore leather care tips, craftsmanship insights, style inspiration, and the stories behind our products.
        </p>
      </div>
    </section>
  )
}

export default BlogHero
