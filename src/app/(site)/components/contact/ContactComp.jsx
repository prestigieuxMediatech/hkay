"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactComp() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="w-full border shadow-sm" data-aos="fade-right">
          <CardContent className="p-6 sm:p-8">
            <h3 className="mb-6 text-xl font-bold sm:text-2xl">
              Send Us a Message
            </h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block font-medium">Full Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="px-3 py-4 font-medium"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Subject</label>
                <Input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Message</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black py-6 text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

              {status ? (
                <p
                  className={`text-sm ${
                    status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status === "success"
                    ? "Your message has been sent successfully."
                    : status}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="w-full border shadow-sm" data-aos="fade-left">
          <CardContent className="p-6 sm:p-8">
            <h3 className="mb-8 text-xl font-bold sm:text-2xl">
              Contact Details
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Email</h4>
                <p className="mt-1 text-gray-600">
                  hkayhandmadeleather@gmail.com
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Phone / WhatsApp</h4>
                <p className="mt-1 text-gray-600">+91 88501 49101</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Business Hours</h4>
                <p className="mt-1 text-gray-600">Monday - Saturday</p>
                <p className="text-gray-600">10:00 AM - 7:00 PM</p>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold">Follow Us</h4>

                <div className="flex gap-4">
                  <div className="cursor-pointer rounded-full border p-3 transition hover:bg-gray-100">
                    <FaInstagram size={20} />
                  </div>

                  <div className="cursor-pointer rounded-full border p-3 transition hover:bg-gray-100">
                    <FaFacebookF size={20} />
                  </div>

                  <div className="cursor-pointer rounded-full border p-3 transition hover:bg-gray-100">
                    <FaYoutube size={20} />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="font-medium">Response Time</p>

                <p className="mt-1 text-gray-600">
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
