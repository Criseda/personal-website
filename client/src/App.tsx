import { ThemeProvider } from "@/components/ThemeProvider";
import { AuroraBackgroundDemo } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";

function App() {
  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {
          <>
            <Navbar />
            <AuroraBackgroundDemo />
          </>
        }
      </ThemeProvider>
  );
}

export default App;
