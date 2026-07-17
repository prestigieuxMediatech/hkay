"use client"
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is your leather genuine / full-grain?",
      answer:
        "Yes, absolutely. We use only 100% genuine full-grain leather sourced from certified tanneries. Full-grain is the highest quality grade — it retains the natural surface of the hide, making every piece unique and more durable than bonded or PU leather.",
    },
    {
      question: "Do you ship across India?",
      answer:
        "Yes, we ship to all major cities and towns across India. Orders are dispatched within 1–2 business days and delivered within 4–7 business days depending on your location. Free shipping is available on orders above ₹999.",
    },
    {
      question: "Can I place a custom or personalised order?",
      answer:
        "Yes! We offer custom orders including personalised monogramming, custom sizing, and colour choices. Simply contact us via WhatsApp or the form above with your requirements.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order is dispatched, you will receive a tracking link via email and SMS. You can use that link to track your shipment in real time.",
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We accept returns and exchanges within 7 days of delivery, provided the product is unused and in its original packaging.",
    },
    {
      question: "How do I care for my leather product?",
      answer:
        "Keep your leather away from direct sunlight and moisture. Use a good leather conditioner every 2–3 months to maintain its suppleness.",
    },
    {
      question: "Will the leather soften or change over time?",
      answer:
        "Yes — full-grain leather develops a rich patina over time. The colour deepens and the texture softens beautifully with age.",
    },
    {
      question: "Do you offer gift wrapping or gift messages?",
      answer:
        "Yes! We offer premium gift packaging with a handwritten message card at no extra charge.",
    },
  ];

  return (
    <section className="bg-white px-6 py-16 md:px-10 md:py-20 lg:px-20">
      {/* Header */}
      <div className="mb-10 text-center md:mb-12">
        <h2
          className="text-3xl font-bold text-gray-900 md:text-4xl"
          data-aos="fade-up"
        >
          Frequently Asked Questions
        </h2>

        <p
          className="mx-auto mt-3 max-w-3xl text-base text-gray-600 md:text-lg"
          data-aos="fade-up"
        >
          Find answers to the most common questions about our leather
          products, shipping, returns, and customization options.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            data-aos="fade-up"
            className={`border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden ${
              openIndex === index ? "border-black" : ""
            }`}
          >
            <CardContent className="p-0">
              {/* Question */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left p-6"
              >
                <span className="pr-4 text-base font-semibold text-gray-900 sm:text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="border-t pt-5">
                    <p className="text-gray-600 leading-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default FAQ;