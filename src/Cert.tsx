import React, { useEffect, useState } from "react";

import * as forge from "node-forge";

import { Panel } from "@vkumov/react-cui-2.0";

interface IForgeCertificate extends forge.pki.Certificate {
  signatureOid: string;
}

interface ICert {
  certObj: forge.pki.Certificate;
}

const signatureOidMap = {
  "1.2.840.113549.1.1.1": "rsaEncryption",
  "1.2.840.113549.1.1.2": "md2WithRSAEncryption",
  "1.2.840.113549.1.1.3": "md4withRSAEncryption",
  "1.2.840.113549.1.1.4": "md5WithRSAEncryption",
  "1.2.840.113549.1.1.5": "sha1-with-rsa-signature",
  "1.2.840.113549.1.1.6": "rsaOAEPEncryptionSET",
  "1.2.840.113549.1.1.7": "id-RSAES-OAEP",
  "1.2.840.113549.1.1.8": "id-mgf1",
  "1.2.840.113549.1.1.9": "id-pSpecified",
  "1.2.840.113549.1.1.10": "id-pSpecified",
  "1.2.840.113549.1.1.11": "sha256WithRSAEncryption",
  "1.2.840.113549.1.1.12": "sha384WithRSAEncryption",
  "1.2.840.113549.1.1.13": "sha512WithRSAEncryption",
  "1.2.840.113549.1.1.14": "sha224WithRSAEncryption",
} as { [key: string]: string };

const decodeDistinguishedName = (attributes: forge.pki.CertificateField[]) => {
  const oidMap = {
    "0.9.2342.19200300.100.1.25": "DC",
    "2.5.4.3": "CN",
  } as { [key: string]: string };
  return attributes
    .map((attribute) => {
      const aType = attribute.type as string;
      let aName = attribute.name;
      if (aName === undefined || oidMap[aType]) {
        aName = oidMap[aType];
      }
      return `${aName}=${attribute.value}`;
    })
    .join(", ");
};

function Cert(props: ICert) {
  const certObj = props.certObj as IForgeCertificate;
  const certPem = forge.pki.certificateToPem(certObj);
  const subjectName = decodeDistinguishedName(certObj.subject.attributes);
  const issuerName = decodeDistinguishedName(certObj.issuer.attributes);
  const signatureType = signatureOidMap[certObj.signatureOid];
  let publicKey = "?";
  /*const pKey = certObj.publicKey as forge.pki.rsa.PublicKey;
  if (pKey.e && pKey.n) {
    // This is likely an RSA key
    const eKey = Buffer.from(pKey.e.toByteArray());
    publicKey = eKey.toString("hex");
  }*/

  return (
    <>
      <div className="row qtr-margin-top">
        <div className="col">
          <Panel color="light" raised={true} padding="loose">
            <div className="row">
              <div className="col">
                <ul>
                  <li>Serial #: {props.certObj.serialNumber}</li>
                  <li>Signature Type: {signatureType}</li>
                  <li>Subject: {subjectName}</li>
                  <li>Issuer: {issuerName}</li>
                  <li>Valid From: {certObj.validity.notBefore.toString()}</li>
                  <li>Valid To: {certObj.validity.notAfter.toString()}</li>
                  <li>
                    Public Key:
                    {publicKey}
                  </li>
                </ul>
              </div>
              <div className="col">
                <pre>{certPem}</pre>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

export default Cert;
