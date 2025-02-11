import "./globals.css";
import Sidebar from "./components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-6 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
