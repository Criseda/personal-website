import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { MusicGeneratorProvider } from "@/contexts/MusicGeneratorContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "@/components/routes/Home";
import Projects from "@/components/routes/Projects";
import LofiStation from "@/components/routes/LofiStation";
import NotFound from "@/components/routes/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LanguageProvider>
          <AuthProvider>
            <MusicGeneratorProvider>
              <Routes>
                {/* English routes */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                
                {/* Lofi Station route */}
                <Route path="/projects/lofi-station" element={<LofiStation />} />
                
                {/* Romanian routes */}
                <Route path="/ro" element={<Home />} />
                <Route path="/ro/*" element={<NotFound />} />
                
                {/* Not found route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MusicGeneratorProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;