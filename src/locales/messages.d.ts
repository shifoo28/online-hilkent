import tm from "./locales/tm.json";

type Messages = typeof tm;
declare module "next-intl" {
  interface IntlMessages extends Messages {}
}
