import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

const posts = [
  {
    title: "How full-grain leather ages",
    category: "Care & Craft",
    status: "Published",
    date: "Jun 2026",
    badgeClass: "bg-green-100 text-green-700",
  },
  {
    title: "Full-grain vs top-grain",
    category: "Leather Guides",
    status: "Published",
    date: "May 2026",
    badgeClass: "bg-green-100 text-green-700",
  },
  {
    title: "Best leather gifts under ₹2,000",
    category: "Gift Ideas",
    status: "Draft",
    date: "May 2026",
    badgeClass: "bg-stone-100 text-stone-600",
  },
  {
    title: "A day in our workshop",
    category: "Behind Us",
    status: "Draft",
    date: "Apr 2026",
    badgeClass: "bg-stone-100 text-stone-600",
  },
]

export default function BlogPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Button
          asChild
          className="bg-[#1c0d02] text-white hover:bg-[#2a1506]"
        >
          <Link href="/admin/blog/new">Write Post</Link>
        </Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.title}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-stone-200" />
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Badge className={post.badgeClass}>{post.status}</Badge>
                  </TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500"
                      >
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
        {posts.map((post) => (
          <Card key={post.title}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-200" />
                <div className="flex-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.category}
                  </p>
                  <Badge className={`mt-2 ${post.badgeClass}`}>
                    {post.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-500"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
