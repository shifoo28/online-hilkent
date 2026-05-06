import { Product } from "./product";

export type Category = {
  id: number;
  name: string;
  image: string;
  products?: Product[];
};

export type CategoryOption = {
  id: number;
  name: string;
  products: number;
};