import React from "react";

import { Panel } from "@vkumov/react-cui-2.0";

function Intro() {
  return (
    <Panel>
      <div className="row">
        <div className="col">
          <h2>Browser Based Certificate Tools</h2>
          <p>
            This is a collection of tools used to manipulate certificate files.
            Many operations like viewing a x509 certificate require using tools
            like openssl. Some people don't have easy access to a linux or mac
            operating system. In addition, learning the syntax and required
            inputs to effectively use openssl can be challenging.
          </p>
          <p>
            This website makes it easier to some of the basic tasks involving
            certificates totally within the browser.{" "}
            <b>
              All operations are done purely in javascript client side.
              Absolutely NO data is sent to a server or backend.
            </b>
          </p>
          <p>
            This tool was created by Jay Young supported by{" "}
            <a href="https://www.cisco.com">Cisco</a>. Any issues with the site
            can be reported to via the{" "}
            <a href="https://github.com/ministryofjay/certtools">
              GitHub repo.
            </a>
          </p>
        </div>
      </div>
    </Panel>
  );
}

export default Intro;
