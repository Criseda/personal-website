import { Navbar } from "@/components/Navbar";
import { AuroraBackgroundHome } from "@/components/AuroraBackground";
import About from "@/components/routes/About";
import Projects from "@/components/routes/Projects";
import Skills from "@/components/routes/Skills";
import Contact from "@/components/routes/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <AuroraBackgroundHome />
      <div className="relative flex flex-col gap-10 md:gap-20">
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </>
  );
}
