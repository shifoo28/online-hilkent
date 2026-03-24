// Client side Log in
export default async function login(email, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    // Cookie is set automatically by server
    window.location.href = "/dashboard";
  } else {
    alert("Login failed");
  }
}

// Change language
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const changeLanguage = (lng) => {
    router.push(router.pathname, router.asPath, { locale: lng });
  };
  return (
    <>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('tm')}>TM</button>
      <button onClick={() => changeLanguage('ru')}>RU</button>
    </>
  );
}

// Clients side translation
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Home');
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

// Optional: Server components
import {getTranslator} from 'next-intl/server';

export default async function ServerComponent({params: {locale}}) {
  const t = await getTranslator(locale, 'Home');
  return <h1>{t('title')}</h1>;
}
