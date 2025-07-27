import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { SidebarTrigger } from "@/components/ui/sidebar";

type proptype = {
  sidebar: boolean;
};

const Navbar: React.FC<proptype> = ({ sidebar }) => {
  const [mobile, setmobile] = useState<boolean>(window.innerWidth < 900);

  const [menu, setmenu] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handlemenu = () => {
    setmenu(true);
  };

  const handleClickOutside = () => {
    setmenu(false);
  };

  useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside);

  const checksize = () => {
    if (window.innerWidth < 900) {
      setmobile(true);
    } else {
      setmobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      checksize();
    });
    return () => {
      window.removeEventListener("resize", () => {
        checksize();
      });
    };
  }, []);

  const links = [
    { name: "Home", link: "/" },
    { name: "Jobs", link: "/job" },
  ];

  const linkslist2 = links.map((x) => {
    return (
      <li
        className={`border-b-2 border-transparent transition-all duration-300 hover:border-black hover:text-black`}
      >
        <Link to={x.link}>{x.name}</Link>
      </li>
    );
  });

  const linkslist = links.map((x) => {
    return (
      <li className={`pr-2 pl-2 text-sm font-semibold`}>
        <Link
          onClick={() => {
            handleClickOutside();
          }}
          to={x.link}
        >
          {x.name}
        </Link>
      </li>
    );
  });

  return (
    <header className="grid justify-items-center shadow-md">
      {mobile ? (
        <>
          <nav className="fixed top-0 left-0 z-50 grid w-full grid-cols-2 items-center bg-white px-4 py-1 shadow-md">
            <div className="grid justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                {sidebar ? (
                  <SidebarTrigger />
                ) : (
                  <Menu
                    size={30}
                    className={`cursor-pointer rounded border p-1 hover:bg-slate-100`}
                    onClick={() => {
                      handlemenu();
                    }}
                  ></Menu>
                )}
              </motion.div>
            </div>
            <div className="grid justify-end py-3">
              <Link to={"/"} className="flex gap-2 text-xl font-bold">
                SmartHR
              </Link>
            </div>
          </nav>
          <AnimatePresence initial={false} onExitComplete={() => null}>
            {menu && (
              <>
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", duration: 0.5 }}
                  ref={ref}
                  className="fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-lg md:w-1/2 md:max-w-full"
                >
                  <div className="flex items-center justify-end p-4">
                    <button
                      className="cursor-pointer rounded border-2 border-slate-300 hover:border-slate-400"
                      onClick={() => handleClickOutside()}
                    >
                      <X size={22} />
                    </button>
                  </div>
                  <ul className="font-inter mb-4 grid gap-4 p-4">
                    {linkslist}
                  </ul>

                  <div className="grid place-items-center gap-2">
                    <Link
                      className={`w-11/12 rounded border border-slate-300 py-2 pr-2 pl-2 text-center text-sm font-semibold`}
                      onClick={() => {
                        handleClickOutside();
                      }}
                      to={"/sign-up"}
                    >
                      Sign Up
                    </Link>
                    <Link
                      className={`w-11/12 rounded bg-slate-900 py-2 pr-2 pl-2 text-center text-sm font-semibold text-white hover:bg-black`}
                      onClick={() => {
                        handleClickOutside();
                      }}
                      to={"/log-in"}
                    >
                      Log In
                    </Link>
                    <Link
                      className={`w-11/12 rounded border border-slate-300 py-2 pr-2 pl-2 text-center text-sm font-semibold`}
                      onClick={() => {
                        handleClickOutside();
                      }}
                      to={"/dashboard"}
                    >
                      Employers/Post Job
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <div className="mb-14"></div>
        </>
      ) : (
        <>
          <nav
            className={`font-inter grid w-11/12 place-items-center text-sm font-semibold`}
          >
            <div
              className={`${styles.container2} grid w-full place-items-center py-3 font-medium`}
            >
              <Link
                to="/"
                className={`flex items-center gap-2 place-self-start text-xl font-bold ${styles.logo}`}
              >
                SmartHR
              </Link>

              <div className={`${styles.links2} flex justify-center`}>
                <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
                  {linkslist2}
                </ul>
              </div>

              <div
                className={`${styles.button2} grid w-full grid-cols-3 justify-items-end gap-2 text-sm font-semibold`}
              >
                <Link to={"/sign-up"}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className={`w-24 justify-self-end rounded-md border border-slate-300 px-2 py-2 text-sm text-black hover:bg-slate-100`}
                  >
                    Sign Up
                  </motion.button>
                </Link>
                <Link to={"/log-in"}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className={`w-24 justify-self-end rounded-md border border-slate-900 bg-slate-900 px-2 py-2 text-white hover:bg-black`}
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to={"/dashboard"}>
                  <motion.button
                    className={`w-32 justify-self-center border-l-2 py-1 text-lg no-underline underline-offset-8 transition-all duration-300 hover:text-black hover:underline`}
                  >
                    Post Job
                  </motion.button>
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
export default Navbar;
