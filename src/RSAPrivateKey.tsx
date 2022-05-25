import React from "react";

import * as forge from "node-forge";
import { Buffer } from "buffer";

import { Panel } from "@vkumov/react-cui-2.0";

export function privateKeyDetails(keyPair: forge.pki.rsa.PrivateKey) {
  const pem = forge.pki.privateKeyToPem(keyPair);
  const modulus = Buffer.from(keyPair.n.toByteArray())
    .toString("hex")
    .toUpperCase();
  const size = keyPair.n.bitLength();
  const exponent = keyPair.e.data[0];
  return { pem, modulus, size, exponent };
}

interface IPrivateKey {
  keyPair: forge.pki.PrivateKey;
  displayPem?: boolean;
}

function RSAPrivateKey(props: IPrivateKey) {
  const displayPem = props.displayPem === undefined ? true : props.displayPem;
  const { pem, modulus, size, exponent } = privateKeyDetails(
    props.keyPair as forge.pki.rsa.PrivateKey
  );
  let formattedModulus = "";
  for (let i = 0; i < modulus.length; i++) {
    if (i % 2 === 0 && i > 0) {
      formattedModulus += ":";
    }
    if (i % 30 === 0 && i > 0) {
      formattedModulus += "\n";
    }
    formattedModulus += modulus[i];
  }
  return (
    <Panel>
      <div className="row">
        <div className="col">
          <h4>RSA Private Key</h4>
        </div>
      </div>
      <div className="row">
        <div className={displayPem ? "col-6" : "col"}>
          <ul style={{ listStyleType: "none" }}>
            <li>Key Size: {size}</li>
            <li>Modulus:</li>
            <li>
              <pre className="qtr-margin-left">{formattedModulus}</pre>
            </li>
            <li>Exponent: {exponent}</li>
            <li></li>
          </ul>
        </div>
        {displayPem && (
          <div className="col-6">
            <Panel well={true} color="light">
              <pre>{pem}</pre>
            </Panel>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default RSAPrivateKey;
