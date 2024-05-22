// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.ico';
import '../styles.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
        <li className="nav-item"> {/* Add this list item for News */}
          <Link to="/news" className="nav-link">
            News
          </Link>
        </li>
        <li className="nav-item"> {/* Add this list item for News */}
          <Link to="/login" className="nav-link">
            Profile
          </Link>
        </li>
        <li className="nav-item"> {/* Add this list item for News */}
          <Link to="/heatmap" className="nav-link">
            HeatMap
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
