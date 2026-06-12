import type { FC, ReactNode } from "react";
import Navbar from "./components/navbar";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
