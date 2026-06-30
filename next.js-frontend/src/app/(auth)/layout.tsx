import AuthLayout from "@/components/auth/AuthLayout";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Access your maritime dashboard and continue your journey."
    >
      {children}
    </AuthLayout>
  );
}