import "./globals.css";

export const metadata = {
  title: "Indian Concall Simplifier",
  description: "Simplified earnings concall summaries for Indian investors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}
