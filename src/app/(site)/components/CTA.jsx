import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20">
      <div className="flex flex-col gap-8 rounded-3xl bg-black p-8 sm:p-10 md:p-16 lg:flex-row lg:items-center lg:justify-between">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ready to find your next everyday essential?
          </h2>

          <p className="mt-4 max-w-2xl text-base text-gray-300 md:text-lg">
            Explore handcrafted leather pieces made for comfort, style, and long lasting use.
          </p>
        </div>

        <Button
          data-aos="fade-left"
          className="
            px-8
            py-6
            rounded-xl
            bg-white
            text-black
            text-base
            hover:bg-gray-200
            transition-all
            duration-300
          "
        >
          Shop Collection
        </Button>
      </div>
    </section>
  );
}
