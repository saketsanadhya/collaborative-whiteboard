import "./globals.css";
import { Itim } from "next/font/google";
import { Toaster } from "react-hot-toast";

const itim = Itim({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Whiteboard",
  description: "A platform for real-time collaborative whiteboard sessions.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="manifest" href={metadata.manifest} />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={itim.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
