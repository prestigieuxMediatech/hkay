import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

function ContactComp() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20">
      {/* Header */}
      <div className="mb-10 text-center md:mb-12">
        <h2
          className="text-3xl font-bold text-gray-900 md:text-4xl"
          data-aos="fade-up"
        >
          Get In Touch
        </h2>

        <p
          className="mx-auto mt-3 max-w-3xl text-base text-gray-600 md:text-lg"
          data-aos="fade-up"
        >
          Have a question or need assistance? Fill out the form and our team
          will get back to you as soon as possible.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Contact Form */}
        <Card
          className="w-full border shadow-sm"
          data-aos="fade-right"
        >
          <CardContent className="p-6 sm:p-8">
            <h3 className="mb-6 text-xl font-bold sm:text-2xl">
              Send Us a Message
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Full Name
                </label>
                <Input placeholder="Enter your full name" className='px-3 py-4 font-medium' />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Subject
                </label>
                <Input placeholder="Enter subject"  />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Message
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[150px]"
                />
              </div>

              <Button
                className="
                  w-full
                  py-6
                  bg-black
                  text-white
                  hover:bg-gray-900
                "
              >
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card
          className="w-full border shadow-sm"
          data-aos="fade-left"
        >
          <CardContent className="p-6 sm:p-8">
            <h3 className="mb-8 text-xl font-bold sm:text-2xl">
              Contact Details
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg">
                  Email
                </h4>
                <p className="text-gray-600 mt-1">
                  hkayhandmadeleather@gmail.com
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">
                  Phone / WhatsApp
                </h4>
                <p className="text-gray-600 mt-1">
                  +91 88501 49101
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">
                  Business Hours
                </h4>
                <p className="text-gray-600 mt-1">
                  Monday - Saturday
                </p>
                <p className="text-gray-600">
                  10:00 AM - 7:00 PM
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">
                  Follow Us
                </h4>

                <div className="flex gap-4">
                  <div className="border rounded-full p-3 hover:bg-gray-100 cursor-pointer transition">
                    <FaInstagram size={20} />
                  </div>

                  <div className="border rounded-full p-3 hover:bg-gray-100 cursor-pointer transition">
                    <FaFacebookF size={20} />
                  </div>

                  <div className="border rounded-full p-3 hover:bg-gray-100 cursor-pointer transition">
                    <FaYoutube size={20} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="font-medium">
                  Response Time
                </p>

                <p className="text-gray-600 mt-1">
                  We typically reply within 24 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ContactComp;
