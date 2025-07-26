import { Link } from "react-router-dom";
const Footer: React.FC = () => {
  return (
    <footer className="grid gap-8 border-t-slate-900 bg-slate-900 p-6 text-sm md:grid-cols-4 md:place-items-start">
      <div className="grid gap-4">
        <Link to={"/"} className="flex gap-2 text-xl font-bold">
          <span className="text-white">SmartHR</span>
        </Link>
        <p className="text-slate-400">
          We provide innovative solutions for modern businesses.
        </p>
      </div>
      <nav className="grid gap-4">
        <h1 className="font-semibold text-slate-200">Navigation</h1>
        <ul className="grid gap-2">
          <li>
            <Link className="text-slate-400 hover:text-white" to={"/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="text-slate-400 hover:text-white" to={"/job"}>
              Job Board
            </Link>
          </li>
          <li>
            <Link className="text-slate-400 hover:text-white" to={"/dashboard"}>
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      <div className="grid gap-4">
        <h1 className="font-semibold text-slate-200">Contact</h1>
        <div className="grid gap-2 text-slate-400">
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@smarthr.com</p>
        </div>
      </div>
      <div className="grid gap-4">
        <h1 className="font-semibold text-slate-200">Socials</h1>
        <div className="grid gap-2 text-slate-400">
          <p>Instagram</p>
          <p>Facebook</p>
        </div>
      </div>
      <p className="border-t border-slate-800 py-2 text-center text-slate-400 md:col-span-4 md:w-full md:place-self-center">
        © 2025 SmartHR. All rights reserved.
      </p>
    </footer>
  );
};
export default Footer;
