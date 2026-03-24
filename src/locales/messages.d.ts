import en from "./locales/en.json";

type Messages = typeof en;
declare module "next-intl" {
  interface IntlMessages extends Messages {}
}
