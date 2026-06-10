"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState } from "react"

const brandBrown = "#3b1f0f"

const categories = [
  "All",
  "Care & Craft",
  "Leather Guides",
  "Style & Wear",
  "Behind Us",
  "Gift Ideas",
]

const featuredPost = {
  category: "Care & Craft",
  title: "How full-grain leather ages beautifully over time",
  excerpt:
    "Full-grain leather doesn't just wear — it tells your story. Here's what changes over years of use and why it only gets better.",
  readTime: "5 min read",
  date: "June 2026",
}

const posts = [
  {
    category: "Care & Craft",
    title: "How to clean your leather wallet properly",
    readTime: "4 min read",
    date: "May 2026",
  },
  {
    category: "Leather Guides",
    title: "Full-grain vs top-grain: what's the real difference?",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    category: "Style & Wear",
    title: "5 ways to style a leather tote bag for work",
    readTime: "5 min read",
    date: "Apr 2026",
  },
  {
    category: "Behind Us",
    title: "A day in our workshop: how a bag is born",
    readTime: "7 min read",
    date: "Apr 2026",
  },
  {
    category: "Gift Ideas",
    title: "Best leather gifts for men under ₹2,000",
    readTime: "4 min read",
    date: "Mar 2026",
  },
  {
    category: "Care & Craft",
    title: "How to condition leather the right way",
    readTime: "3 min read",
    date: "Mar 2026",
  },
]

const popularPosts = [
  "How to clean your leather wallet properly",
  "Full-grain vs top-grain: what's the real difference?",
  "5 ways to style a leather tote bag for work",
  "Best leather gifts for men under ₹2,000",
]

const categoryCounts = [
  { name: "Care & Craft", count: 8 },
  { name: "Leather Guides", count: 6 },
  { name: "Style & Wear", count: 5 },
  { name: "Behind Us", count: 4 },
  { name: "Gift Ideas", count: 3 },
]

const tags = ["leather", "care", "bags", "wallets", "gifts", "style", "craft"]

function BlogComp() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-20">
        <div className="space-y-16">
          <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_18px_40px_rgba(59,31,15,0.06)] sm:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-300/40 via-transparent to-stone-500/20" />
              </div>

              <div className="space-y-5">
                <span
                  className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: brandBrown }}
                >
                  {featuredPost.category}
                </span>

                <h2 className="max-w-xl font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.65rem]">
                  {featuredPost.title}
                </h2>

                <p className="max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                  {featuredPost.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                  <span>{featuredPost.readTime}</span>
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  <span>{featuredPost.date}</span>
                </div>

                <a
                  href="#"
                  className="inline-flex text-sm font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:text-[#3b1f0f] hover:decoration-[#3b1f0f]"
                >
                  Read article →
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {categories.map((category) => {
                const isActive = activeCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-transparent text-white shadow-sm"
                        : "border-stone-300 bg-transparent text-stone-800 hover:border-stone-400 hover:bg-stone-50"
                    }`}
                    style={isActive ? { backgroundColor: brandBrown } : undefined}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]">
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.title}
                    className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-300/30 via-transparent to-stone-500/10 transition duration-300 group-hover:scale-105" />
                    </div>

                    <div className="space-y-3 p-5">
                      <span className="inline-flex rounded-full bg-[#f5e8dd] px-3 py-1 text-xs font-medium text-[#3b1f0f]">
                        {post.category}
                      </span>

                      <h3 className="line-clamp-2 text-base font-semibold leading-6 text-stone-900">
                        {post.title}
                      </h3>

                      <p className="text-xs text-stone-500">
                        {post.readTime} · {post.date}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full rounded-lg border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#3b1f0f]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Popular Posts
                </h3>
                <ol className="mt-4 space-y-3">
                  {popularPosts.map((title, index) => (
                    <li key={title} className="flex gap-3 text-sm text-stone-700">
                      <span className="mt-0.5 text-xs font-medium text-stone-400">
                        {index + 1}.
                      </span>
                      <a href="#" className="transition hover:underline">
                        {title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Categories
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  {categoryCounts.map((item) => (
                    <li key={item.name}>
                      <a href="#" className="transition hover:underline">
                        {item.name} ({item.count})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <div className="h-28 w-full bg-neutral-200" />
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Slim Wallet
                      </p>
                      <p className="text-sm text-stone-500">₹1,100</p>
                    </div>
                    <a
                      href="#"
                      className="inline-flex text-sm font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:text-[#3b1f0f] hover:decoration-[#3b1f0f]"
                    >
                      Browse collection →
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Tags
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="flex items-center justify-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`min-w-10 rounded-md border px-4 py-2 text-sm transition ${
                  page === 1
                    ? "border-transparent text-white shadow-sm"
                    : "border-stone-300 text-stone-700 hover:bg-stone-50"
                }`}
                style={page === 1 ? { backgroundColor: brandBrown } : undefined}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-100">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center md:px-10 lg:px-20">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Get leather care tips & new posts in your inbox
            </h2>
            <p className="text-sm text-stone-600 sm:text-base">
              No spam. Just craft, care, and stories from the workshop.
            </p>

            <form className="mx-auto flex max-w-xl flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-l-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-[#3b1f0f] sm:flex-1"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-[#3b1f0f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4a2a16]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogComp
