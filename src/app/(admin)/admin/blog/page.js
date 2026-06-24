"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeClass(status) {
  return status === "published"
    ? "bg-green-100 text-green-700"
    : "bg-stone-100 text-stone-600";
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBlogPosts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/blogs", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load blog posts");
      }

      setBlogPosts(data.blogPosts || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog post");
      }

      await loadBlogPosts();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  useEffect(() => {
    void (async () => {
      await loadBlogPosts();
    })();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage titles, slugs, cover images, categories, and publishing status.
          </p>
        </div>
        <Button asChild className="bg-[#1c0d02] text-white hover:bg-[#2a1506]">
          <Link href="/admin/blog/new">Write Post</Link>
        </Button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      {!blogPosts.length ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-stone-800">No blog posts found.</p>
            <p className="mt-2 text-sm text-stone-500">
              Add the first post to start filling this section.
            </p>
            <Button
              asChild
              className="mt-6 bg-[#1c0d02] text-white hover:bg-[#2a1506]"
            >
              <Link href="/admin/blog/new">Write Post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="hidden md:block">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-stone-200">
                          {post.cover_image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                              />
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-stone-900">{post.title}</div>
                        <p className="text-sm text-stone-500">{post.slug}</p>
                      </TableCell>
                      <TableCell>{post.category || "No category"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(post.status)}>
                          {post.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.published_at || post.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/blog/${post.id}`}>
                              <PencilLine className="mr-2 size-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-3 md:hidden">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                      {post.cover_image ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.category || "No category"}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {post.slug}
                      </p>
                      <Badge className={`mt-2 ${getStatusBadgeClass(post.status)}`}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-stone-600">
                    {post.excerpt || "No excerpt added yet."}
                  </p>
                  <p className="mt-2 text-xs text-stone-500">
                    {formatDate(post.published_at || post.created_at)}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/blog/${post.id}`}>
                        <PencilLine className="mr-2 size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
