import { Link, Outlet} from "react-router-dom";
import "../../index.css";

const NavBar = () => {

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-2 shadow-lg backdrop-blur-xl overflow-hidden">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          <span className="glass-shine pointer-events-none absolute inset-0" />
          <Link
            to="/"
            className="relative rounded-full px-5 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-white/70 hover:text-gray-950 hover:scale-105 hover:shadow-md active:scale-95"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="relative rounded-full px-5 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-white/70 hover:text-gray-950 hover:scale-105 hover:shadow-md active:scale-95"
          >
            About
          </Link>
          <Link
            to="user/Invitado"
            className="relative rounded-full px-5 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-white/70 hover:text-gray-950 hover:scale-105 hover:shadow-md active:scale-95"
          >
            User
          </Link>
          <Link
            to= "post/1"
            className="relative rounded-full px-5 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-white/70 hover:text-gray-950 hover:scale-105 hover:shadow-md active:scale-95"
          >
            Post
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
