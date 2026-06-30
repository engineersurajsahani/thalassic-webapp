import Link from "next/link";

export default function LoginForm() {
  return (
    <div>

      <div className="space-y-5">

        <div>
          <label className="block mb-2 font-medium text-gray-900">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@example.com"
            className="w-full rounded-xl border border-gray-500 px-4 py-3 focus:border-blue-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-900">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-500 px-4 py-3 focus:border-blue-700 focus:outline-none"
          />
        </div>

      </div>

      <div className="flex justify-end mt-3">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        className="mt-8 w-full rounded-xl bg-[#0A2540] py-3 font-semibold text-white transition hover:bg-[#12385c]"
      >
        Login
      </button>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>

    </div>
  );
}