import React, { useEffect, useState } from "react";

import Csr from "./Csr";
import {
  Panel,
  Input,
  Radios,
  Dropdown,
  DropdownElement,
  Menu,
} from "@vkumov/react-cui-2.0";
import { Buffer } from "buffer";

import * as forge from "node-forge";
import InputFile from "./InputFile";

function ViewCsr() {
  const [csr, setCsr] = useState<any>();
  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>View CSR</h4>
      <InputFile
        allowedFileTypes={""}
        pemHeader="CERTIFICATE REQUEST"
        onFileLoad={(derInput) => {
          const asn1Blob = forge.asn1.fromDer(derInput.data);
          const csrObject = forge.pki.certificationRequestFromAsn1(asn1Blob);
          setCsr(csrObject);
        }}
      ></InputFile>
      <Csr csr={csr}></Csr>
    </Panel>
  );
}

export default ViewCsr;
