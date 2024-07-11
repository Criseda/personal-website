import { LayoutGridDemo } from "../LayoutGrid";

export default function About() {
  return (
    <div className="relative flex flex-col h-screen px-4">
      <div className="text-2xl md:text-5xl font-bold dark:text-white text-center w-full">
        About
      </div>
      <div className="relative h-full flex flex-row">
        <div className="w-full relative flex justify-center items-center">
          {/* <div className="absolute inset-0 my-20 rounded-full  scale-[0.52] bg-gray-500 blur-3xl z-[-1]"></div>
          <img src="https://github.com/criseda.png" alt="Avatar" className="relative shadow-xl border border-gray-800 rounded-full object-cover"/> */}
          <LayoutGridDemo/>
        </div>
        <div className="w-full relative px-4 flex flex-col gap-4 justify-center">
          <div className="relative flex">
            <div className="absolute inset-0 h-full w-full  scale-[0.80] dark:bg-gray-500 rounded-full blur-3xl" />
            <div className="relative shadow-xl dark:bg-gray-900 border border-gray-800 px-5 py-8 h-full max-h-min overflow-hidden rounded-2xl flex flex-col ">
              <div>
                <p className="font-extralight text-base md:text-4xl dark:text-white py-4">
                  I am a Computer Science student at the University of
                  Manchester. My areas of interest include web development,
                  operating systems, and machine learning. I am always looking
                  for new opportunities to learn and grow as a developer.
                </p>
              </div>
              <div>
                <p className="font-extralight text-base md:text-4xl dark:text-white py-4">
                  In my free time, I enjoy working on personal projects and
                  creating music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
