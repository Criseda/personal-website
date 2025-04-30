import { ThemeProvider } from "@/components/ThemeProvider";
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
      {
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Router>
      }
    </ThemeProvider>
  );
}

export default App;