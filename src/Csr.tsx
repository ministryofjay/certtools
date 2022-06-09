import React, { useEffect, useState } from "react";

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

interface ICsr {
  csr: any;
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

function Csr(props: ICsr) {
  const csr = props.csr;

  let subjectDnArray = [];
  if (csr.subject.attributes) {
    for (let attr of csr.subject.attributes) {
      subjectDnArray.push(`${attr.shortName}=${attr.value}`);
    }
  }
  const publicKeyInfo = { n: "", nSize: 0, e: "" };
  publicKeyInfo.n = "";
  const pKey = csr.publicKey as forge.pki.rsa.PublicKey;
  if (pKey) {
    publicKeyInfo.nSize = pKey.n.bitLength();
    const nKey = Buffer.from(pKey.n.toByteArray())
      .toString("hex")
      .toUpperCase();
    publicKeyInfo.n = prettyHexString(nKey, 15);
    publicKeyInfo.e = pKey.e.toString();
  }

  let signature = "";
  if (csr.signature) {
    signature = prettyHexString(
      Buffer.from(csr.signature).toString("hex").toUpperCase(),
      25
    );
  }

  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>Certificate Request</h4>
      <ul>
        <li>Version: {csr.version}</li>
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
          <span>Signature Algorithm: </span>
          <pre className="qtr-margin-left">{signature}</pre>
        </li>
      </ul>
    </Panel>
  );
}

export default Csr;
