"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation'

export const Client = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/dashboard";
  return (
    <SignIn forceRedirectUrl={redirectUrl}/>
    // <SignIn.Root>
    //   <SignIn.Step name="start" className="sm:w-fit">
    //     <div>
    //       <Clerk.GlobalError className="block text-sm text-red-400" />
    //     </div>
    //     <div className="w-full">
    //       <Clerk.Connection name="google" asChild>
    //         <Button
    //           variant={"outline"}
    //           size={"_2xl"}
    //           radius={"full"}
    //           className="border-2"
    //           disabled={loading == AuthProviders.GOOGLE || loading != null}
    //           onClick={() => setLoading(AuthProviders.GOOGLE)}
    //         >
    //           <div className="flex items-center gap-2">
    //             {loading == AuthProviders.GOOGLE ? (
    //               <DotSpinner className="size-10 text-gray-6" gap={3.5} />
    //             ) : (
    //               <div className="flex items-center gap-2">
    //                 <Icon
    //                   icon="flat-color-icons:google"
    //                   className="size-9 mr-2"
    //                 />{" "}
    //                 Continue with Google
    //               </div>
    //             )}
    //           </div>
    //         </Button>
    //       </Clerk.Connection>
    //     </div>
    //   </SignIn.Step>
    //   <SignIn.Step name="sso-callback">
    //     <SignIn.Captcha />
    //     <div>
    //       <DotSpinner className="size-10 text-gray-6" gap={3.5} />
    //     </div>
    //   </SignIn.Step>
    // </SignIn.Root>
  );
};
