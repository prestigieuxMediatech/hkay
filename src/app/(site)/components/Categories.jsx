import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default async function Categories() {
  const { data: categories = [], error } = await supabase
    .from("categories")
    .select("id, name, slug, image, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Failed to load categories:", error.message);
    return null;
  }

  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
      <div className="mb-10 flex flex-col gap-6 border-b pb-8 md:mb-12 md:flex-row md:items-center md:justify-between">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Categories
          </h2>

          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Discover our premium handcrafted leather collection
          </p>
        </div>

        <Button
          className="px-8 py-6 rounded-xl bg-black text-white text-base cursor-pointer hover:scale-105 transition-all duration-300"
          data-aos="fade-left"
        >
          Explore Categories
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 py-0 gap-0 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
            data-aos="fade-down"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-stone-200">
                    <span className="text-sm font-medium text-stone-500">
                      No image
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-6 left-0 w-full">
                  <h3 className="text-center text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
