import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="navbar">

      {/* LEFT LOGO */}
      <div>
        <h1>Railway Management System</h1> 
      </div>

      {/* RIGHT MENU */}
      <div className="navbar-right">

        <Link to="/home" className="navbar-link">
          Dashboard
        </Link>

        <span
          className="navbar-link"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </span>

        <span
          className="navbar-link"
          onClick={() => navigate("/profile")}
        >
           Profile
        </span>

      </div>
    </nav>
  );
};

export default Navbar;