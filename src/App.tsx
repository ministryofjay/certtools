import React, { useState } from "react";
import "./App.css";
import "./public/css/cui-standard.min.css";
import ExtractPkcs12Tool from "./ExtractPkcs12";
import Tool2 from "./Tool2";

function App() {
  const tabs = [
    { name: "Tool1", component: <ExtractPkcs12Tool></ExtractPkcs12Tool> },
    { name: "Tool2", component: <Tool2></Tool2> },
  ];
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].name);

  return (
    <div>
      <header className="header">
        <div className="container-fluid">
          <div className="header-panels">
            <div className="header-panel">
              <div className="header__title">Your App Title</div>
            </div>
            <div className="header-panel header-panel--right">
              <a className="header-item">Link 1</a>
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
                .map(({ component }) => component)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
