import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/shop-without-sidebar",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
  {
    id: 4,
    title: "pages",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 1,
        title: "Checkout",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 2,
        title: "Cart",
        newTab: false,
        path: "/cart",
      },
      {
        id: 3,
        title: "Error",
        newTab: false,
        path: "/error",
      },
      {
        id: 4,
        title: "Mail Success",
        newTab: false,
        path: "/mail-success",
      },
    ],
  },
  // {
  //   id: 5,
  //   title: "blogs",
  //   newTab: false,
  //   path: "/",
  //   submenu: [
  //     {
  //       id: 51,
  //       title: "Blog Grid with sidebar",
  //       newTab: false,
  //       path: "/blogs/blog-grid-with-sidebar",
  //     },
  //     {
  //       id: 52,
  //       title: "Blog Grid",
  //       newTab: false,
  //       path: "/blogs/blog-grid",
  //     },
  //     {
  //       id: 53,
  //       title: "Blog details with sidebar",
  //       newTab: false,
  //       path: "/blogs/blog-details-with-sidebar",
  //     },
  //     {
  //       id: 54,
  //       title: "Blog details",
  //       newTab: false,
  //       path: "/blogs/blog-details",
  //     },
  //   ],
  // },
];
