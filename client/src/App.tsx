import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl text-red-500 font-bold underline mb-5">
        Hello world!
      </h1>
      <Button variant="destructive">Click me!</Button>
    </div>
  );
}

export default App;
