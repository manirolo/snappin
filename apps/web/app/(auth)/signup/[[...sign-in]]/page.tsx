{
  /*
   * Authentication handled by Clerk
   * There are no sign in page both sign in and sign up are handled in the same page by Clerk
   * There two separate container one is occupied for sign in and another for product demo tour or may customer reviews
   */
}

import { Layout } from "../../_components/layout";
import { Client as SignInClient } from "./client";

export default function Page() {
  return (
    <div className="flex justify-center flex-col xl:items-center xl:flex-row min-h-screen ">
      <Layout>
        <SignInClient />
      </Layout>
      <div className="hidden bg-gray-6 xl:flex xl:w-1/2">
        {/* Product demo tour or customer reviews can go here */}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Sign up to Snappin",
  description:
    "Sign up to your Snappin account to extract your invoices from mails",
};
