import { AboutCard } from "../AboutCard";
import { LayoutGridDemo } from "../LayoutGrid";

export default function About() {
  return (
    <div className="relative flex flex-col h-screen px-4">
      <div className="text-2xl md:text-5xl font-bold dark:text-white text-center w-full">
        About
      </div>
      <div className="relative h-full flex flex-row">
        <div className="w-full relative flex justify-center items-center">
          <LayoutGridDemo/>
        </div>
        <div className="w-full relative flex justify-center items-center">
          <div className="relative flex h-screen py-20 px-10 w-full justify-center items-center">
            <AboutCard/>
          </div>
        </div>
      </div>
    </div>
  );
}
