import "./globals.css";

export const metadata = {
  title: "Cards → JSON",
  description: "Drop a photo of playing cards, get JSON.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
