{
  /*
   * Authentication handled by Clerk
   * There are no sign in page both sign in and sign up are handled in the same page by Clerk
   * There two separate container one is occupied for sign in and another for product demo tour or may customer reviews
   */
}

import { Layout } from "../../_components/layout";
import { Client as SignInClient } from "./client";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <div className="flex justify-between flex-col xl:items-center xl:flex-row overflow-auto min-h-screen py-10 xl:py-0">
        <Layout>
          <SignInClient />
        </Layout>
        <div className="relative hidden bg-gray-6 xl:flex h-screen lg:w-180 2xl:w-210">
          <div className="absolute z-10 top-0 left-0 right-0 bottom-0 bg-green-4"></div>
        </div>
      </div>
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sign up to Snappin App",
            description:
              "Sign up to your Snappin App account to extract your invoices from mails",
            url: "https://www.snappinapp.com/signup",
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
  title: "Sign up to Snappin",
  description:
    "Sign up to your Snappin account to extract your invoices from mails",
};
