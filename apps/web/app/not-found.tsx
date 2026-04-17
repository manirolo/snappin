import { H1, Small } from "@snappin/ui/components/typography";
import { LandingLayout } from "../components/navbar/dashboard.navbar";

export default function NotFound() {
  return (
    <LandingLayout>
      <div className="flex flex-col max-w-md mx-auto items-center justify-center gap-2 mt-6 text-center min-h-[50vh]">
        <H1>404</H1>
        <Small>
          We&#39;ve searched the entire globe, but we couldn&#39;t find what you were
          looking for. Maybe it existed once, but now it&#39;s gone.
        </Small>
      </div>
    </LandingLayout>
  );
}

export const metadata = {
  title: "Page Not Found | Snappin",
  description: "The page you are looking for does not exist.",
};
