import { H4 } from "@snappin/ui/components/typography";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <H4>This page does not exist 😅</H4>
    </div>
  )
}

export const metadata = {
  title: "Page Not Found | Snappin",
  description: "The page you are looking for does not exist.",
};
