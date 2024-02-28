import { GeistMono, GeistSans } from "geist/font";
import "./globals.css";


export const metadata = {
  title: "NoteApp",
  description: "Note taking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  );
}
