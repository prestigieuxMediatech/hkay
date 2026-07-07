export const metadata = {
  title: "Terms & Conditions | HKAY Leather Goods",
  description: "Read the Terms & Conditions for HKAY Leather Goods, including orders, payments, shipping, liability, and governing law.",
};

const sections = [
  {
    title: "1. General",
    content: [
      "These terms govern your use of our website and any purchases made through it. We reserve the right to update or modify these terms at any time without prior notice. Continued use of the website after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Products",
    content: [
      "All products listed on HKAY are handcrafted leather goods. Since our items are made from natural leather, slight variations in color, texture, and grain are natural characteristics of the material and not considered defects.",
    ],
  },
  {
    title: "3. Pricing",
    content: [
      "All prices listed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change product prices at any time without prior notice.",
    ],
  },
  {
    title: "4. Orders",
    content: [
      "Once an order is placed and payment is confirmed, you will receive an order confirmation via email. We reserve the right to cancel any order due to product unavailability, pricing errors, or suspected fraudulent activity, in which case a full refund will be issued.",
    ],
  },
  {
    title: "5. Payments",
    content: [
      "We accept payments through secure third-party payment gateways. HKAY does not store your card or payment details on its servers.",
    ],
  },
  {
    title: "6. Shipping",
    content: [
      "Orders are processed and shipped within [X] business days. Delivery timelines may vary based on location and courier availability. HKAY is not responsible for delays caused by courier partners or unforeseen circumstances.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "All content on this website, including images, logos, and product designs, is the property of HKAY Leather Goods and may not be reproduced without written permission.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "HKAY shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These terms are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in [City, State].",
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      "For any questions regarding these Terms & Conditions, please contact us at hkayhandmadeleather@gmail.com or +91 88501 49101.",
    ],
  },
];

const intro =
  'Welcome to HKAY Leather Goods ("HKAY," "we," "us," or "our"). By accessing or using our website (hkayleathergoods.com) and purchasing our products, you agree to be bound by the following Terms & Conditions. Please read them carefully before placing an order.';

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
            <p className="text-stone-500">Last updated: 07/07/2026</p>

            <p>{intro}</p>

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
