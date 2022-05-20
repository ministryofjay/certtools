import React, { useState } from "react";

import { Panel } from "@vkumov/react-cui-2.0";
import InputFile from "./InputFile";

import * as forge from "node-forge";

function ViewCert() {
  const [certificateDer, setCertificateDer] = useState<forge.util.ByteBuffer>(
    forge.util.createBuffer("")
  );

  const onFileLoaded = (derInput: forge.util.ByteBuffer) => {
    console.log("got call back");
    setCertificateDer(derInput);
  };

  return (
    <Panel>
      <Panel>
        <h2>Certificate Details</h2>
      </Panel>
      <Panel>
        <InputFile
          allowedFileTypes=".cer,.crt"
          pemHeader="CERTIFICATE"
          onFileLoad={onFileLoaded}
        ></InputFile>
        <div>der got {certificateDer.data.length}</div>
      </Panel>
    </Panel>
  );
}

export default ViewCert;
