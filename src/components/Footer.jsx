import Link from "next/link";

export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Shop", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  const support = ["Help Center", "Shipping", "Returns", "Privacy Policy"];

  return (
    <footer className="border-t bg-gray-50 px-6 md:px-10 lg:px-20 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">HKAY</h3>
          <p className="mt-4 text-gray-600 leading-7">
            Premium leather goods crafted with care, made to fit into your everyday life.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
          <div className="mt-4 space-y-3 text-gray-600">
            {links.map((item) => (
              <Link key={item.label} href={item.href} className="block hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900">Support</h4>
          <div className="mt-4 space-y-3 text-gray-600">
            {support.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900">Contact</h4>
          <div className="mt-4 space-y-3 text-gray-600">
            <p>support@hkay.com</p>
            <p>+91 98765 43210</p>
            <p>Available Monday to Saturday</p>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
        <p>&copy; 2026 HKAY. All rights reserved.</p>
        <p>Designed for simple, timeless shopping.</p>
      </div>
    </footer>
  );
}
