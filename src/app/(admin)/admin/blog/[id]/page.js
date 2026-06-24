"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import BlogForm from "@/app/(site)/components/admin/BlogForm";

export default function EditBlogPage({ params }) {
  const resolvedParams = use(params);
  const blogPostId = resolvedParams?.id;
  const hasValidBlogPostId = Boolean(blogPostId && blogPostId !== "undefined");

  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(hasValidBlogPostId);
  const [error, setError] = useState(
    hasValidBlogPostId ? "" : "Blog post id is missing."
  );

  useEffect(() => {
    if (!hasValidBlogPostId) {
      return;
    }

    void (async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/blogs/${blogPostId}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found. It may have been deleted.");
          }

          throw new Error(data.error || "Failed to load blog post");
        }

        setBlogPost(data.blogPost || null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [hasValidBlogPostId, blogPostId]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-rose-600">{error}</p>
        <Link
          href="/admin/blog"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          Back to blog posts
        </Link>
      </div>
    );
  }

  return (
    <BlogForm
      blogPost={blogPost}
      title="Edit Blog Post"
      backHref="/admin/blog"
      backLabel="Blog Posts"
      submitLabel="Update Post"
      actionUrl={`/api/admin/blogs/${blogPostId}`}
      method="PATCH"
    />
  );
}
