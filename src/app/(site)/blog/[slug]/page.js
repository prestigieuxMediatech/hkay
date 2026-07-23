import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedBlogPostBySlug } from "@/lib/blog-posts";

function formatDate(value) {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPublishedBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16 lg:px-20">
        <Link
          href="/blog"
          className="mb-8 inline-flex text-sm font-medium text-stone-600 underline underline-offset-4 transition hover:text-[#3b1f0f]"
        >
          Back to blog
        </Link>

        <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_40px_rgba(59,31,15,0.06)]">
          {post.cover_image ? (
            <div className="aspect-[16/9] w-full overflow-hidden bg-stone-200">
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </>
            </div>
          ) : null}

          <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f5e8dd] px-3 py-1 text-xs font-medium text-[#3b1f0f]">
                {post.category || "Uncategorized"}
              </span>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {post.title}
              </h1>

              <p className="text-sm text-stone-500">
                {formatDate(post.published_at || post.created_at)}
              </p>
            </div>

            {post.excerpt ? (
              <p className="max-w-3xl text-lg leading-8 text-stone-700">
                {post.excerpt}
              </p>
            ) : null}

            {post.content ? (
              <div className="whitespace-pre-wrap text-base leading-8 text-stone-700">
                {post.content}
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                This post does not have body content yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
