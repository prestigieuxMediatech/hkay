export const metadata = {
  title: "Privacy Policy | HKAY Leather Goods",
  description: "Read how HKAY Leather Goods collects, uses, shares, and protects your personal information when you visit or purchase from our website.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We may collect the following information when you use our website:",
    ],
    list: [
      "Personal details (name, email address, phone number, shipping address) provided during account creation or checkout",
      "Payment information, processed securely through our third-party payment gateway (we do not store card details)",
      "Browsing data such as IP address, device type, and pages visited, for analytics purposes",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use the information collected to:",
    ],
    list: [
      "Process and fulfill your orders",
      "Communicate order updates, shipping, and delivery information",
      "Improve our website and customer experience",
      "Send promotional emails, only if you have opted in",
    ],
  },
  {
    title: "3. Data Sharing",
    content: [
      "We do not sell or rent your personal information to third parties. We may share necessary information with trusted partners such as payment gateways and courier/logistics providers solely to complete your order.",
    ],
  },
  {
    title: "4. Data Security",
    content: [
      "We implement reasonable technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "5. Cookies",
    content: [
      "Our website may use cookies to enhance user experience, such as remembering cart items and login sessions. You can disable cookies through your browser settings, though this may affect website functionality.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "You may request access to, correction of, or deletion of your personal data by contacting us at hkayhandmadeleather@gmail.com.",
    ],
  },
  {
    title: "7. Third-Party Links",
    content: [
      "Our website may contain links to third-party sites. We are not responsible for the privacy practices of those websites.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date.",
    ],
  },
  {
    title: "9. Contact Us",
    content: [
      "If you have questions about this Privacy Policy, please contact us at hkayhandmadeleather@gmail.com or +91 88501 49101.",
    ],
  },
];

const intro =
  'HKAY Leather Goods ("we," "us," or "our") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit or make a purchase on hkayleathergoods.com.';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="bg-stone-900 h-[200px] sm:h-[220px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-16">
          <p className="text-stone-400 text-sm mb-2">Home / Policies / Privacy Policy</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Privacy Policy</h1>
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
