export const metadata = {
  title: "Gourmet Chicken Hero Generator",
  description: "Generate ultra-detailed gourmet hero shots with creamy sauces"
};

import "./globals.css";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-lemon-100 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}

