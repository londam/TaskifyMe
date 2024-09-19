import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SideBar from "./SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskify Me",
  description: "Best app there is!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className="flex">
        <SideBar></SideBar>
        <main className="p-5">{children}</main>
      </body>
    </html>
  );
}
