import "./globals.css";

export const metadata = {
  title: "Hari Om Thalassic",
  description: "Maritime Career Partners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}