export const metadata = {
  title: "Refund Policy | HKAY Leather Goods",
  description: "Read HKAY Leather Goods' refund and return policy, including return eligibility, refund timelines, damaged items, and contact details.",
};

const sections = [
  {
    title: "1. Return Eligibility",
    list: [
      "Returns are accepted within 7 days of delivery.",
      "Products must be unused, undamaged, and in their original packaging with tags intact.",
      "Customized or personalized leather products are not eligible for return unless defective.",
    ],
  },
  {
    title: "2. How to Initiate a Return",
    content: [
      "To request a return, contact us at hkayhandmadeleather@gmail.com with your order number and reason for return within the eligibility window. Our team will guide you through the process.",
    ],
  },
  {
    title: "3. Return Shipping",
    content: [
      "Customers are responsible for return shipping costs unless the item received was defective, damaged, or incorrect, in which case HKAY will cover the return shipping.",
    ],
  },
  {
    title: "4. Refunds",
    content: [
      "Once the returned item is received and inspected, we will notify you of the approval status. Approved refunds will be processed to your original payment method within 5-7 business days.",
    ],
  },
  {
    title: "5. Damaged or Defective Items",
    content: [
      "If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the issue, and we will arrange a replacement or full refund at no additional cost.",
    ],
  },
  {
    title: "6. Exchanges",
    content: [
      "We currently do not offer direct exchanges. If you'd like a different size or product, please initiate a return and place a new order.",
    ],
  },
  {
    title: "7. Non-Returnable Items",
    list: [
      "Sale/clearance items (unless defective)",
      "Customized or made-to-order products",
      "Gift cards, if applicable",
    ],
  },
  {
    title: "8. Contact Us",
    content: [
      "For any questions about returns or refunds, reach out to us at hkayhandmadeleather@gmail.com or +91 88501 49101.",
    ],
  },
];

const intro =
  "At HKAY Leather Goods, we want you to be fully satisfied with your purchase. If you're not, here's how our returns and refunds process works.";

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
            <p className="text-stone-500">Last updated: 07/07/2026</p>

            <p>{intro}</p>

            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                  {section.title}
                </h2>
                {section.content?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
