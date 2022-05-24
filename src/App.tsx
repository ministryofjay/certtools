import React, { useState } from "react";
import "./public/css/cui-standard.min.css";

import ExtractPkcs12Tool from "./ExtractPkcs12";
import Intro from "./Intro";
import BuildPkcs12 from "./BuildPkcs12";
import ViewCert from "./ViewCert";

function App() {
  const tabs = [
    { name: "Home", component: <Intro></Intro> },
    { name: "View Certificate", component: <ViewCert></ViewCert> },
    {
      name: "Open PKCS12",
      component: <ExtractPkcs12Tool></ExtractPkcs12Tool>,
    },
    { name: "Build PKCS12", component: <BuildPkcs12></BuildPkcs12> },
  ];
  const [currentTab, setCurrentTab] = useState<string>(tabs[3].name);

  return (
    <div>
      <header className="header">
        <div className="container-fluid">
          <div className="header-panels">
            <div className="header-panel">
              <div className="header__title">
                Browser Based Certificate Tools
              </div>
            </div>
            <div className="header-panel header-panel--right">
              <a
                className="header-item"
                href="https://github.com/ministryofjay/certtools"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="content content--alt">
        <div className="row">
          <nav className="sidebar col-2" role="navigation">
            <div className="sidebar__header">
              <div className="sidebar__header-title">Title Area</div>
            </div>
            <ul>
              {tabs.map((tab, index) => {
                return (
                  <li key={index} className="sidebar__item">
                    <a
                      href="#"
                      tabIndex={index}
                      onClick={() => setCurrentTab(tab.name)}
                    >
                      {tab.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="col-10">
            <div className="panel">
              {tabs
                .filter(({ name }) => {
                  return name === currentTab;
                })
                .map((tab, index) => (
                  <div key={index}>{tab.component}</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
