import React from 'react'

function ContactHero() {
  return (
    <section
        className="relative flex min-h-[320px] sm:min-h-[400px] lg:min-h-[450px] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/contact.png')" }}
        >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

        <div className="relative z-10 mx-auto mt-16 flex max-w-4xl flex-col items-center justify-center px-6 pt-8 text-center text-white sm:mt-20 sm:px-10 md:px-16 lg:px-20">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                We'd Love to Hear From You
            </h2>

            <p className="max-w-2xl text-base sm:text-lg">
                Whether you have a question, feedback, or a custom request, our team is here to help.
            </p>
        </div>
    </section>
  )
}

export default ContactHero
