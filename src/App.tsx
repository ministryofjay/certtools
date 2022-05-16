import React from "react";
import "./App.css";
import "./public/css/cui-standard.min.css";
const forge = require("node-forge");

function App() {
  const a = 100;
  const b = forge;
  const c = 200;
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-panels">
            <div className="header-panel">
              <a
                className="header__logo"
                href="http://www.cisco.com"
                target="_blank"
              >
                <span className="icon-cisco"></span>
              </a>
              <div className="header__title">Your App Title</div>
            </div>
            <div className="header-panel header-panel--right">
              <a className="header-item">Link 1</a>
              <a className="header-item">Link 2</a>
              <a className="header-item">Link 3</a>
            </div>
          </div>
        </div>
      </header>
      <div className="row dbl-padding-bottom">
        <div className="col-lg-6 col-xl-4 base-padding-bottom">
          <div className="subheader">Basic</div>
          <nav className="sidebar" role="navigation">
            <div className="sidebar__header">
              <div className="sidebar__header-title">Title Area</div>
            </div>
            <ul>
              <li className="sidebar__item">
                <a tabIndex={0}>Home</a>
              </li>
              <li className="sidebar__item">
                <a tabIndex={1}>Alerts</a>
              </li>
              <li className="sidebar__item">
                <a tabIndex={2}>Charts</a>
              </li>
              <li className="sidebar__item">
                <a tabIndex={3}>Devices</a>
              </li>
              <li className="sidebar__item">
                <a tabIndex={4}>Settings</a>
              </li>
              <li className="sidebar__item">
                <a tabIndex={5}>Help</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default App;
