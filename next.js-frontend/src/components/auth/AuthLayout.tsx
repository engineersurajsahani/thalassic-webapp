interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-center bg-[#0A2540] px-20 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Hari Om
            <br />
            Thalassic
          </h1>

          <p className="text-slate-300 text-xl leading-9 max-w-md">
            Empowering aspiring seafarers with world-class maritime
            education, career guidance and placement opportunities.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-10">

            <h2 className="text-3xl font-bold text-slate-800">
              {title}
            </h2>

            <p className="mt-2 text-slate-500">
              {subtitle}
            </p>

            <div className="mt-8">
              {children}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}