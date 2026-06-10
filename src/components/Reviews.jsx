import React from 'react'
import { Button } from "@/components/ui/button";

function Reviews() {
    const reviews = [
        {
            name: "Rahul Sharma",
            review:
            "The leather quality exceeded my expectations. The craftsmanship is outstanding and the bag feels premium in every detail.",
        },
        {
            name: "Priya Mehta",
            review:
            "I purchased a wallet and have been using it daily for months. It still looks as elegant as the day I received it.",
        },
        {
            name: "Arjun Patel",
            review:
            "The attention to detail is impressive. From stitching to finishing, everything reflects true craftsmanship.",
        },
    ];
  return (
    <section className="px-6 md:px-10 lg:px-20 py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-8 mb-12">
            <div data-aos="fade-right">
                <h2 className="text-4xl font-bold text-gray-900">
                    What Our Customers Say
                </h2>

                <p className="mt-3 text-gray-600 text-lg">
                    Trusted by thousands who appreciate quality craftsmanship and timeless design.
                </p>
            </div>

            <Button
            data-aos="fade-left"
            className="
                px-8
                py-6
                rounded-xl
                bg-black
                text-white
                text-base
                hover:scale-105
                transition-all
                duration-300
            "
            >
            Read All Reviews
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <div
                key={review.name}
                className="
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:shadow-lg
                    transition-all
                    duration-300
                "
                data-aos="fade-up"
                >
                {/* Stars */}
                <div className="flex gap-1 text-yellow-500 text-lg mb-4">
                    ★★★★★
                </div>

                {/* Review */}
                <p className="text-gray-600 leading-7">
                    "{review.review}"
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3 mt-6">
                    <div
                    className="
                        h-12
                        w-12
                        rounded-full
                        bg-black
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                    "
                    >
                    {review.name.charAt(0)}
                    </div>

                    <div>
                    <h4 className="font-semibold text-gray-900">
                        {review.name}
                    </h4>

                    <p className="text-sm text-gray-500">
                        Verified Customer
                    </p>
                    </div>
                </div>
                </div>
            ))}
        </div>
    
    </section>
  )
}

export default Reviews