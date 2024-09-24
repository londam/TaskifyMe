import { Metadata } from "next";
import AppConfig from "../../layout/AppConfig";
import React from "react";

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "TASKIFY me",
  description: "Voice Your Tasks Into Action.",
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <React.Fragment>
      {children}
      <AppConfig simple />
    </React.Fragment>
  );
}
