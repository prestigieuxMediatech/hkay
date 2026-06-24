import BlogForm from "@/app/(site)/components/admin/BlogForm";

export default function AddBlogPage() {
  return (
    <BlogForm
      title="Write Post"
      backHref="/admin/blog"
      backLabel="Blog Posts"
      submitLabel="Save Post"
      actionUrl="/api/admin/blogs"
    />
  );
}
