export const metadata = {
  title: "Privacy Policy | HKAY Leather Goods",
  description:
    "Read how HKAY Leather Goods collects, uses, shares, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We may collect information including your name, email address, phone number, billing address, shipping address, and order details for the purpose of processing and delivering your purchases.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "Your personal information is used solely for the following purposes:",
    ],
    list: [
      "Processing and fulfilling your orders",
      "Providing customer support",
      "Sending order confirmations and shipping updates",
      "Improving our products, services, and customer experience",
      "Communicating important information related to your purchase",
    ],
  },
  {
    title: "Payment Security",
    content: [
      "All online payments are securely processed through trusted third-party payment gateways. HKAY LEATHER GOODS does not store or have access to your complete payment card or banking information.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell, rent, or trade your personal information with any third party. Your information is shared only with trusted payment providers and logistics partners whenever necessary to complete your order or comply with legal obligations.",
    ],
  },
  {
    title: "Data Protection",
    content: [
      "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, disclosure, alteration, or misuse.",
    ],
  },
];

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
            <p>
              At HKAY LEATHER GOODS, protecting your privacy is one of our highest priorities. We
              are committed to safeguarding your personal information and ensuring that your data
              is handled responsibly and securely.
            </p>

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
