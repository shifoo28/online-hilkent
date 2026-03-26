import React from "react";
import BlogGridWithSidebar from "@/components/BlogGridWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Grid Page | Hilkent Nextjs E-commerce web app",
  description: "This is Blog Grid Page for Hilkent Web App",
  // other metadata
};

const BlogGridWithSidebarPage = () => {
  return (
    <>
      <BlogGridWithSidebar />
    </>
  );
};

export default BlogGridWithSidebarPage;
