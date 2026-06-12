import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

const products = [
  {
    name: "Briefcase Pro",
    category: "Bags",
    price: "₹4,200",
    stock: 8,
  },
  {
    name: "Slim Wallet",
    category: "Wallets",
    price: "₹1,100",
    stock: 24,
  },
  {
    name: "Classic Belt",
    category: "Belts",
    price: "₹900",
    stock: 2,
  },
  {
    name: "Tote Bag",
    category: "Bags",
    price: "₹3,500",
    stock: 11,
  },
]

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button
          asChild
          className="bg-[#1c0d02] text-white hover:bg-[#2a1506]"
        >
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-stone-200" />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell
                    className={
                      product.stock < 5 ? "font-medium text-red-500" : ""
                    }
                  >
                    {product.stock}
                  </TableCell>
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
        {products.map((product) => (
          <Card key={product.name}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-200" />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} · {product.price}
                  </p>
                </div>
                <p
                  className={
                    product.stock < 5
                      ? "font-medium text-red-500"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {product.stock}
                </p>
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
