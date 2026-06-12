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

export default function AddProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 block text-sm text-muted-foreground"
      >
        ← Products
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">Add Product</h1>

      <Card className="mx-auto max-w-xl">
        <CardContent className="p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Product Image
            </label>
            <div className="flex h-28 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50">
              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Product Name
            </label>
            <Input placeholder="e.g. Slim Wallet" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Price (₹)
            </label>
            <Input type="number" placeholder="e.g. 1100" />
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
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="wallets">Wallets</SelectItem>
                <SelectItem value="belts">Belts</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Stock Quantity
            </label>
            <Input type="number" placeholder="e.g. 20" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Description
            </label>
            <Textarea rows={4} placeholder="Describe the product..." />
          </div>

          <Button className="w-full bg-[#1c0d02] text-white hover:bg-[#2a1506]">
            Save Product
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
