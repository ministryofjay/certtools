import React, { useCallback, useMemo, useState } from "react";

import { Panel } from "@vkumov/react-cui-2.0";
import InputFile from "./InputFile";

import * as forge from "node-forge";
import Cert from "./Cert";

function ViewCert() {
  const [certificateDer, setCertificateDer] = useState<forge.util.ByteBuffer>(
    forge.util.createBuffer("")
  );

  const [certificateObject, setCertificateObject] =
    useState<forge.pki.Certificate>();

  const onFileLoaded = useCallback((derInput: forge.util.ByteBuffer) => {
    try {
      const asn1Blob = forge.asn1.fromDer(derInput.data);
      const certObj = forge.pki.certificateFromAsn1(asn1Blob);
      setCertificateObject(certObj);
      setCertificateDer(derInput);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
        {certificateObject && (
          <Cert certObj={certificateObject} displayPem={false}></Cert>
        )}
      </Panel>
    </Panel>
  );
}

export default ViewCert;
