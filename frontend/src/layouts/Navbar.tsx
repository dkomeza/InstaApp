import { NavLink } from "react-router-dom";

import "@assets/styles/layouts/navbar.scss";

import home from "@assets/img/nav/house-solid.svg";
import search from "@assets/img/nav/magnifying-glass-solid.svg";
import explore from "@assets/img/nav/square-rss-solid.svg";
import messages from "@assets/img/nav/envelope-solid.svg";
import add from "@assets/img/nav/circle-plus-solid.svg";
import user from "@assets/img/nav/user-solid.svg";
import menu from "@assets/img/nav/bars-solid.svg";

function Navbar() {
  return (
    <aside className="navbar">
      <div className="top">
        <h1>Instaapp</h1>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={home} alt="" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={search} alt="" /> Search
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={explore} alt="" /> Explore
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messages"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={messages} alt="" /> Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/post"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={add} alt="" /> Post
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={user} alt="" /> Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="bottom">
        <div className="more-navbar">
          <img src={menu} alt="" />
          More
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
9;
