export const metadata = {
  title: "Terms & Conditions | HKAY Leather Goods",
  description:
    "Read the Terms & Conditions for HKAY Leather Goods, including handmade craftsmanship, pricing, custom orders, product images, and intellectual property.",
};

const sections = [
  {
    title: "Handmade Craftsmanship",
    content: [
      "All our products are individually handcrafted using carefully selected premium leather. Every item is made entirely by hand with great attention to detail. As a result, slight variations in leather grain, texture, color, stitching, and finish are natural characteristics of genuine handmade craftsmanship and should not be considered defects. These unique characteristics make every product one of a kind.",
    ],
  },
  {
    title: "Product Availability",
    content: [
      "Most of our products are handcrafted after an order is confirmed. Production time may vary depending on the complexity of the design, customization requirements, and our current production schedule.",
    ],
  },
  {
    title: "Pricing",
    content: [
      "All prices displayed on the website are shown in the selected currency and are subject to change without prior notice. Once an order has been successfully placed and confirmed, the agreed price will remain applicable for that purchase.",
    ],
  },
  {
    title: "Custom Orders",
    content: [
      "Customized and personalized products are specially handcrafted according to the customer's specifications. Therefore, once production has started, custom orders cannot be cancelled, modified, exchanged, or refunded.",
    ],
  },
  {
    title: "Product Images",
    content: [
      "We make every effort to display our products as accurately as possible. However, due to the natural characteristics of genuine leather, handmade craftsmanship, lighting conditions, and screen settings, slight variations in color, texture, and finish may occur.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All product designs, photographs, logos, branding, graphics, website content, and other intellectual property displayed on this website are the exclusive property of HKAY LEATHER GOODS. Any unauthorized copying, reproduction, distribution, or commercial use is strictly prohibited without prior written permission.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="bg-stone-900 h-[200px] sm:h-[220px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-16">
          <p className="text-stone-400 text-sm mb-2">Home / Policies / Terms & Conditions</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Terms & Conditions</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="space-y-8 text-sm leading-8 text-stone-700 sm:text-base">
            <p>Welcome to HKAY LEATHER GOODS.</p>

            <p>
              By accessing our website and placing an order, you agree to the following Terms &amp;
              Conditions.
            </p>

            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                  {section.title}
                </h2>
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
