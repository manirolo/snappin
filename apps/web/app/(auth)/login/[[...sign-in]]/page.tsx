{
  /*
   * Authentication handled by Clerk
   * There are no sign in page both sign in and sign up are handled in the same page by Clerk
   * There two separate container one is occupied for sign in and another for product demo tour or may customer reviews
   */
}

import { Layout } from "../../_components/layout";
import { Client as SignInClient } from "./login.client";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <Layout>
        <SignInClient />
      </Layout>
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sign in to Snappin App",
            description:
              "Sign in to your Snappin App account to extract your invoices from mails",
            url: "https://www.snappinapp.com/login",
            publisher: {
              "@type": "Organization",
              name: "Snappin App",
              url: "https://www.snappinapp.com",
            },
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Sign in to Snappin App",
  description:
    "Sign in to your Snappin App account to extract your invoices from mails",
};
