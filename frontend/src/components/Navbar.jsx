import React, { useState, useEffect } from "react";
import { Award, LogIn, LogOut, Menu, X } from "lucide-react";
import { navbarStyles } from "../assets/dummyStyles";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = ({ logoSrc }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null);

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName") || "";
    setLoggedIn(!!token);
    setUserInitial(token ? name.charAt(0).toUpperCase() : null);

    const handler = (ev) => {
      const detailUser = ev?.detail?.user ?? null;
      setLoggedIn(!!detailUser);
      setUserInitial(detailUser?.name?.charAt(0)?.toUpperCase() || null);
    };
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.dispatchEvent(new CustomEvent("authChanged", { detail: { user: null } }));
    setLoggedIn(false);
    setUserInitial(null);
    setMenuOpen(false);
    try {
      navigate("/login");
      toast.success("Logout successfully!");
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <nav className={navbarStyles.nav}>
      {/* Decorative elements */}
      <div className={navbarStyles.decorativePattern} style={{ backgroundImage: navbarStyles.decorativePatternBackground, backgroundRepeat: "repeat", backgroundSize: "100px 100px" }} />
      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>

      <div className={navbarStyles.container}>
        {/* Logo */}
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={ "https://img.freepik.com/free-vector/creative-puzzle-solving-question-mark-template-with-human-face-design_1017-58908.jpg?semt=ais_rp_50_assets&w=740&q=80"}
                alt="ByteQuiz logo"
                className={navbarStyles.logoImage}
              />
            </div>
          </Link>
        </div>

        {/* Title */}
        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>ByteQuiz</h1>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className={navbarStyles.desktopButtonsContainer + " flex items-center gap-3"}>
          <NavLink to="/result" className={navbarStyles.resultsButton}>
            <Award className={navbarStyles.buttonIcon} /> My Result
          </NavLink>

          {loggedIn ? (
            <>
              {/* User avatar */}
              {userInitial && (
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center" title="Your account">
                  {userInitial}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" /> Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={navbarStyles.mobileMenuContainer}>
          <button onClick={() => setMenuOpen((s) => !s)} className={navbarStyles.menuToggleButton}>
            {menuOpen ? <X className={navbarStyles.menuIcon} /> : <Menu className={navbarStyles.menuIcon} />}
          </button>

          {menuOpen && (
            <div className={navbarStyles.mobileMenuPanel}>
              <ul className={navbarStyles.mobileMenuList}>
                <li>
                  <NavLink to="/result" onClick={() => setMenuOpen(false)} className={navbarStyles.mobileMenuItem}>
                    <Award className={navbarStyles.mobileMenuIcon} /> My Result
                  </NavLink>
                </li>

                {loggedIn ? (
                  <li className="flex items-center gap-2 px-3 py-2">
                    {userInitial && (
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                        {userInitial}
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 