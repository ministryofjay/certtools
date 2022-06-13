import React, { useCallback, useState } from "react";

import Csr from "./Csr";
import { Panel } from "@vkumov/react-cui-2.0";

import * as forge from "node-forge";
import InputFile from "./InputFile";

function ViewCsr() {
  const [csr, setCsr] = useState<any>();

  const onFileLoad = useCallback((derInput: forge.util.ByteBuffer) => {
    const asn1Blob = forge.asn1.fromDer(derInput.data);
    const csrObject = forge.pki.certificationRequestFromAsn1(asn1Blob);
    setCsr(csrObject);
  }, []);

  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>View CSR</h4>
      <InputFile
        allowedFileTypes={""}
        pemHeader="CERTIFICATE REQUEST"
        onFileLoad={onFileLoad}
      ></InputFile>
      <Csr csr={csr} displayPem={false}></Csr>
    </Panel>
  );
}

export default ViewCsr;
