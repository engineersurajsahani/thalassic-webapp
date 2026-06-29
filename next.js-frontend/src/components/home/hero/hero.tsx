import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#0A2540] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              Trusted Maritime Career Partner
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              A Complete
              <br />
              Seafarer's Home
            </h1>

            <p className="text-gray-300 text-lg mt-8 leading-8 max-w-xl">
              From maritime training and documentation to job placements and
              travel assistance, we guide seafarers through every step of their
              professional journey.
            </p>

            <div className="flex gap-5 mt-10">

              <Link
                href="/courses"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-lg font-semibold transition"
              >
                Explore Courses
              </Link>

              <Link
                href="/about"
                className="border border-white text-white hover:bg-white hover:text-[#0A2540] px-7 py-4 rounded-lg font-semibold transition"
              >
                Learn More
              </Link>

            </div>

          </div>

          {/* Right */}

          <div className="bg-white rounded-3xl p-8 shadow-2xl">

            <div className="grid grid-cols-2 gap-8">

              <div>
                <h2 className="text-4xl font-bold text-[#0A2540]">
                  500+
                </h2>

                <p className="text-gray-600 mt-2">
                  Seafarers Assisted
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0A2540]">
                  50+
                </h2>

                <p className="text-gray-600 mt-2">
                  Partner Institutes
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0A2540]">
                  100%
                </h2>

                <p className="text-gray-600 mt-2">
                  Verified Support
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0A2540]">
                  24/7
                </h2>

                <p className="text-gray-600 mt-2">
                  Guidance
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}