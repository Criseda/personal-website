import { ThemeProvider } from "@/components/ThemeProvider";
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
import LofiSurvey from "@/components/routes/LofiSurvey";
import LofiPrivacyPolicy from "@/components/routes/LofiPrivacyPolicy";
import LofiTermsOfService from "@/components/routes/LofiTermsOfService";
import NotFound from "@/components/routes/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <MusicGeneratorProvider>
            <Routes>
              {/* Main routes */}
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />

              {/* Lofi Station routes */}
              {/* Lofi Station routes */}
              <Route path="/projects/lofi-station" element={<LofiStation />} />
              <Route path="/projects/lofi-station/survey" element={<LofiSurvey />} />
              <Route path="/projects/lofi-station/privacy" element={<LofiPrivacyPolicy />} />
              <Route path="/projects/lofi-station/terms" element={<LofiTermsOfService />} />

              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MusicGeneratorProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;