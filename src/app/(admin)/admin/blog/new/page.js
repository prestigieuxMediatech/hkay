"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function WritePostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-4 block text-sm text-muted-foreground"
      >
        ← Blog
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">Write Post</h1>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Cover Image
            </label>
            <div className="flex h-28 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50">
              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Post Title
            </label>
            <Input placeholder="Post title..." className="text-lg" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Category
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="care">Care & Craft</SelectItem>
                <SelectItem value="guides">Leather Guides</SelectItem>
                <SelectItem value="style">Style & Wear</SelectItem>
                <SelectItem value="behind">Behind Us</SelectItem>
                <SelectItem value="gifts">Gift Ideas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Content
            </label>
            <Textarea rows={10} placeholder="Write your post here..." />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto">
              Save as Draft
            </Button>
            <Button className="w-full bg-[#1c0d02] text-white hover:bg-[#2a1506] sm:w-auto">
              Publish Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
