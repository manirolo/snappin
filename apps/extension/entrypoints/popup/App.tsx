import { useUser, Show } from "@clerk/chrome-extension";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Button } from "@snappin/ui/components/button";
import { Navbar } from "./components/navbar";
import { extensionEnv } from "@snappin/env/extension";
import SnappinLogo from "/favicon.svg"
import { VendorsPage } from "./pages/vendors";

function App() {
  const { isLoaded } = useUser();
  return (
    <div className="bg-background min-h-full">
      {!isLoaded && (
        <div className="min-h-[90vh] flex justify-center items-center">
          <Spinner className="size-8"/>
        </div>
      )}
      {isLoaded && (
        <div>
          <Show when={"signed-out"}>
            <Login />
          </Show>
          <Show when={"signed-in"}>
            <Dashboard />
          </Show>
        </div>
      )}
    </div>
  );
}

function Login() {
  const appUrl = extensionEnv.app.appUrl

  function handleSignIn() {
    // Open web app sign-in in a new tab
    chrome.tabs.create({ url: `${appUrl}/login` })
    // Close the popup so user focuses on the new tab
    window.close()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-4 p-6 text-center">
      <img src={SnappinLogo} className="size-7" />
      <h4 className="text-lg font-semibold">Sign in to Snappin</h4>
      <p className="text-sm text-muted-foreground max-w-50">
        Sign in on the Snappin website to activate the extension
      </p>
      <Button
        onClick={handleSignIn}
        // className="mt-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Go to Snappin to sign in
      </Button>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <Navbar />
       <VendorsPage />
    </div>
  );
}

export default App;
