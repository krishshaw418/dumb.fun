import { Button } from "./ui/button";
function Navbar() {
  return (
    <nav className="flex justify-between items-center px-5 py-3.5 border-b-[#212225] border-b-2 sticky top-0 z-50 bg-[#111113]">
      <h1 className="font-extrabold text-2xl">Dumb.fun</h1>
      <div className="flex gap-5">
        <Button
          size="lg"
          className="rounded-lg bg-[#212225] text-base font-extralight"
        >
          Create
        </Button>
        <Button
          size="lg"
          className="rounded-lg bg-[#212225] text-base font-extralight"
        >
          Sign in
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
