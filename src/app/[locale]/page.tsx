import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hilkent | Nextjs E-commerce web app",
  description: "This is Home for Hilkent Web App",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
