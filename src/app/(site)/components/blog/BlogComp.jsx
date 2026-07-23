"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

const brandBrown = "#3b1f0f";

function formatDate(value) {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function estimateReadTime(post) {
  const text = `${post?.excerpt || ""} ${post?.content || ""}`.trim();

  if (!text) {
    return "3 min read";
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));

  return `${minutes} min read`;
}

export default function BlogComp({ blogPosts = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        blogPosts
          .map((post) => post.category?.trim())
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [blogPosts]);

  const categoryCounts = useMemo(() => {
    const counts = blogPosts.reduce((accumulator, post) => {
      const category = post.category?.trim() || "Uncategorized";
      accumulator.set(category, (accumulator.get(category) || 0) + 1);
      return accumulator;
    }, new Map());

    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return blogPosts.filter((post) => {
      const category = post.category?.trim() || "Uncategorized";
      const matchesCategory =
        activeCategory === "All" || category === activeCategory;
      const matchesQuery =
        !query ||
        [post.title, post.excerpt, post.content, post.category, post.slug]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, blogPosts, searchQuery]);

  const featuredPost = filteredPosts[0] || null;
  const listPosts = filteredPosts.slice(1);
  const postsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(listPosts.length / postsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedPosts = listPosts.slice(
    (safePage - 1) * postsPerPage,
    safePage * postsPerPage
  );
  const popularPosts = listPosts.slice(0, 4);
  const tags = categories
    .filter((category) => category !== "All")
    .slice(0, 7)
    .map((category) => category.toLowerCase());

  function updateCategory(category) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  function updateSearch(value) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white">
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16 lg:px-20">
        <div className="space-y-16">
          {featuredPost ? (
            <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_18px_40px_rgba(59,31,15,0.06)] sm:p-6 lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200"
                >
                  {featuredPost.cover_image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition duration-500"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-300/40 via-transparent to-stone-500/20" />
                  )}
                </Link>

                <div className="space-y-5">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: brandBrown }}
                  >
                    {featuredPost.category || "Uncategorized"}
                  </span>

                  <h2 className="max-w-xl font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.65rem]">
                    {featuredPost.title}
                  </h2>

                  <p className="max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                    {featuredPost.excerpt ||
                      "Open the post to read the full story from the workshop."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                    <span>{estimateReadTime(featuredPost)}</span>
                    <span className="h-1 w-1 rounded-full bg-stone-300" />
                    <span>
                      {formatDate(
                        featuredPost.published_at || featuredPost.created_at
                      )}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex text-sm font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:text-[#3b1f0f] hover:decoration-[#3b1f0f]"
                  >
                    Read article
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-dashed border-stone-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-medium text-stone-800">
                No published blog posts yet.
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Once an admin publishes a post, it will appear here automatically.
              </p>
            </section>
          )}

          <section className="rounded-3xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-transparent text-white shadow-sm"
                        : "border-stone-300 bg-transparent text-stone-800 hover:border-stone-400 hover:bg-stone-50"
                    }`}
                    style={isActive ? { backgroundColor: brandBrown } : undefined}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]">
            <div className="space-y-8">
              {listPosts.length ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {pagedPosts.map((post) => (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post.id}
                      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
                        {post.cover_image ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-stone-300/30 via-transparent to-stone-500/10" />
                        )}
                      </div>

                      <div className="space-y-3 p-5">
                        <span className="inline-flex rounded-full bg-[#f5e8dd] px-3 py-1 text-xs font-medium text-[#3b1f0f]">
                          {post.category || "Uncategorized"}
                        </span>

                        <h3 className="line-clamp-2 text-base font-semibold leading-6 text-stone-900">
                          {post.title}
                        </h3>

                        <p className="text-xs text-stone-500">
                          {estimateReadTime(post)} |{" "}
                          {formatDate(post.published_at || post.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
                  {featuredPost
                    ? "No additional posts match the selected filter."
                    : "No posts match the selected filter."}
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(event) => updateSearch(event.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#3b1f0f]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Popular Posts
                </h3>
                <ol className="mt-4 space-y-3">
                  {popularPosts.length ? (
                    popularPosts.map((post, index) => (
                      <li key={post.id} className="flex gap-3 text-sm text-stone-700">
                        <span className="mt-0.5 text-xs font-medium text-stone-400">
                          {index + 1}.
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition hover:underline"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-stone-500">
                      More posts will appear here once the list grows.
                    </li>
                  )}
                </ol>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Categories
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  {categoryCounts.length ? (
                    categoryCounts.map((item) => (
                      <li key={item.name}>
                        <button
                          type="button"
                          onClick={() => updateCategory(item.name)}
                          className="transition hover:underline"
                        >
                          {item.name} ({item.count})
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-500">No categories yet.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <div className="h-28 w-full bg-neutral-200">
                    {featuredPost?.cover_image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featuredPost.cover_image}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover"
                        />
                      </>
                    ) : null}
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Latest published post
                      </p>
                      <p className="text-sm text-stone-500">
                        {featuredPost?.category || "HKAY Journal"}
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex text-sm font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:text-[#3b1f0f] hover:decoration-[#3b1f0f]"
                    >
                      Browse collection
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Tags
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.length ? (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-700"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-stone-500">
                      Tags will appear once posts are published.
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </section>

          <section className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage <= 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-10 rounded-md border px-4 py-2 text-sm transition ${
                  page === safePage
                    ? "border-transparent text-white shadow-sm"
                    : "border-stone-300 text-stone-700 hover:bg-stone-50"
                }`}
                style={page === safePage ? { backgroundColor: brandBrown } : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        </div>
      </section>

    </div>
  );
}
