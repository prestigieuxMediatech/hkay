export const metadata = {
  title: "Refund Policy | HKAY Leather Goods",
  description:
    "Read HKAY Leather Goods' refund and return policy, including handmade products, custom products, damaged items, and refund processing.",
};

const sections = [
  {
    title: "Handmade Products",
    content: [
      "Due to the handmade nature of our products, returns or refunds are generally not accepted for change of mind, incorrect selection, or personal preference.",
    ],
  },
  {
    title: "Custom Products",
    content: [
      "Customized, personalized, and made-to-order products are specially crafted according to customer requirements and therefore cannot be returned, exchanged, or refunded once production has begun.",
    ],
  },
  {
    title: "Damaged or Incorrect Items",
    content: [
      "If you receive a damaged, defective, or incorrect product, please contact us within 48 hours of receiving your order. Kindly provide clear photographs along with your order details so that our team can review the issue and provide an appropriate resolution, which may include a replacement where applicable.",
    ],
  },
  {
    title: "Refund Processing",
    content: [
      "If a refund is approved under exceptional circumstances, it will be processed through the original payment method within 5-7 business days, depending on your payment provider.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="bg-stone-900 h-[200px] sm:h-[220px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-16">
          <p className="text-stone-400 text-sm mb-2">Home / Policies / Refund Policy</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Refund &amp; Return Policy</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="space-y-8 text-sm leading-8 text-stone-700 sm:text-base">
            <p>
              Customer satisfaction is extremely important to us. Every product is individually
              handcrafted with precision and care.
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
