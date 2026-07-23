import BlogComp from "../components/blog/BlogComp";
import BlogHero from "../components/blog/BlogHero";

import { getPublishedBlogPosts } from "@/lib/blog-posts";

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogPosts();

  return (
    <div>
      <BlogHero />
      <BlogComp blogPosts={blogPosts} />
    </div>
  );
}
