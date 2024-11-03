import type { Metadata } from "next";
import { Inter } from "next/font/google";
import App from "@/components/app";
import { FC, PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis",
  description: "Safe Access to Your Health Journey.",
};

type RootLayoutProps = PropsWithChildren;

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  );
};

export default RootLayout;
