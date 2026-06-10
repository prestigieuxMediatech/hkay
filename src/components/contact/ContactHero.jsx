import React from 'react'

function ContactHero() {
  return (
    <section
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/contact.png')" }}
        >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

        {/* Content */}
        <div className="relative mt-20 z-10 px-20 text-white flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold mb-4">
                We'd Love to Hear From You
            </h2>

            <p className="text-lg">
                Whether you have a question, feedback, or a custom request, our team is here to help.
            </p>
        </div>
    </section>
  )
}

export default ContactHero