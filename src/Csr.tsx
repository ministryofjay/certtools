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

function Csr(props: ICsr) {
  const csr = props.csr;
  const publicKeyInfo = { n: "", nSize: 0, e: "" };
  publicKeyInfo.n = "";
  const pKey = csr.publicKey as forge.pki.rsa.PublicKey;
  if (pKey) {
    publicKeyInfo.nSize = pKey.n.bitLength();
    const nKey = Buffer.from(pKey.n.toByteArray())
      .toString("hex")
      .toUpperCase();
    for (let i = 0; i < nKey.length; i++) {
      if (i % 2 === 0 && i > 0) {
        publicKeyInfo.n += ":";
      }
      if (i % 30 === 0 && i > 0) {
        publicKeyInfo.n += "\n";
      }
      publicKeyInfo.n += nKey[i];
    }
    publicKeyInfo.e = pKey.e.toString();
  }

  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>Certificate Request</h4>
      <ul>
        <li>Version: {csr.version}</li>
        <li>Subject: </li>
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
      </ul>
    </Panel>
  );
}

export default Csr;
