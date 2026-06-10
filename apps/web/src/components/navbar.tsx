import { Button } from "./ui/button";
function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 border-b sticky top-0 z-50 bg-white/30 backdrop-blur-lg">
      <h1 className="font-extrabold text-2xl">Dumb.fun</h1>
      <div className="flex gap-5">
        <Button variant="outline" size="lg" className="rounded-lg">
          Create
        </Button>
        <Button variant="outline" size="lg" className="rounded-lg">
          Sign in
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
