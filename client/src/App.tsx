import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "@/components/routes/Home";
import NotFound from "@/components/routes/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <LanguageProvider>
          <Routes>
            {/* English routes */}
            <Route path="/" element={<Home />} />
            
            {/* Romanian routes */}
            <Route path="/ro" element={<Home />} />
            <Route path="/ro/*" element={<NotFound />} />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;