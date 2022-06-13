import React from "react";

import { Panel } from "@vkumov/react-cui-2.0";
import { Buffer } from "buffer";

import * as forge from "node-forge";

interface ICsr {
  csr: any;
  displayPem?: boolean;
}

function prettyHexString(inHex: string, bytesWidth: number): string {
  let tmpStr = "";
  for (let i = 0; i < inHex.length; i++) {
    if (i % 2 === 0 && i > 0) {
      tmpStr += ":";
    }
    if (i % (bytesWidth * 2) === 0 && i > 0) {
      tmpStr += "\n";
    }
    tmpStr += inHex[i];
  }
  return tmpStr;
}

const shortNameToNameMap: { [key: string]: string } = {
  serialNumber: "SN",
  unstructuredAddress: "unstructuredAddress",
  unstructuredName: "unstructuredName",
};

function Csr(props: ICsr) {
  const displayPem = props.displayPem === undefined ? true : props.displayPem;
  const csr = props.csr;

  let subjectDnArray = [];
  if (csr?.subject.attributes) {
    for (let attr of csr.subject.attributes) {
      const shortName =
        attr.shortName || (shortNameToNameMap[attr.name as string] as string);
      subjectDnArray.push(`${shortName}=${attr.value}`);
    }
  }
  const publicKeyInfo = { n: "", nSize: 0, e: "" };
  publicKeyInfo.n = "";
  const pKey = csr?.publicKey as forge.pki.rsa.PublicKey;
  if (pKey) {
    publicKeyInfo.nSize = pKey.n.bitLength();
    const nKey = Buffer.from(pKey.n.toByteArray())
      .toString("hex")
      .toUpperCase();
    publicKeyInfo.n = prettyHexString(nKey, 15);
    publicKeyInfo.e = pKey.e.toString();
  }

  let signature = "";
  if (csr?.signature) {
    try {
      for (let i = 0; i < csr.signature.length; i++) {
        const x = csr.signature.charCodeAt(i).toString(16).toUpperCase();
        signature += x.length === 2 ? x : "0" + x;
      }
      signature = prettyHexString(signature, 18);
    } catch (error: any) {
      console.log(error);
    }
  }

  let signatureAlgorithm = "";
  try {
    signatureAlgorithm = forge.pki.oids[csr.signatureOid];
  } catch (error) {}

  let csrPem: string;
  try {
    csrPem = forge.pki.certificationRequestToPem(csr);
  } catch (error: any) {
    csrPem = "";
  }

  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>Certificate Request</h4>
      <div className="row">
        <div className="col">
          <ul style={{ listStyleType: "none" }}>
            <li>Version: {csr?.version}</li>
            <li>
              Subject: <span>{subjectDnArray.join(", ")}</span>
            </li>
            <li>
              <span>Subject Public Key Info:</span>
              <span>
                <ul style={{ listStyleType: "none" }}>
                  <li>Key Size: {publicKeyInfo.nSize}</li>
                  <li>Modulus:</li>
                  <li>
                    <pre className="qtr-margin-left">{publicKeyInfo.n}</pre>
                  </li>
                  <li>Exponent: {publicKeyInfo.e}</li>
                  <li></li>
                </ul>
              </span>
            </li>
            <li>
              <span>Signature Algorithm: {signatureAlgorithm}</span>
              <pre className="qtr-margin-left">{signature}</pre>
            </li>
          </ul>
        </div>
        {displayPem && (
          <div className="col">
            <pre>{csrPem}</pre>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default Csr;
