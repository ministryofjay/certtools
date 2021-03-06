import React from "react";

import * as forge from "node-forge";

import { Panel } from "@vkumov/react-cui-2.0";

import { Buffer } from "buffer";
import CertificateExtension from "./CertExtension";

interface IForgeCertificate extends forge.pki.Certificate {
  signatureOid: string;
}

interface ICert {
  certObj: forge.pki.Certificate;
  displayPem?: boolean;
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
  const displayPem = props.displayPem === undefined ? true : props.displayPem;
  const certObj = props.certObj as IForgeCertificate;
  const certPem = forge.pki.certificateToPem(certObj);
  const subjectName = decodeDistinguishedName(certObj.subject.attributes);
  const issuerName = decodeDistinguishedName(certObj.issuer.attributes);
  const signatureType = signatureOidMap[certObj.signatureOid];
  let publicKeyInfo = {} as { n?: string; e?: string; nSize?: number };
  let publicKeyType = "";
  if (certObj.publicKey.hasOwnProperty("n")) {
    // This is likely an RSA key
    publicKeyType = "rsa";
    publicKeyInfo.n = "";
    const pKey = certObj.publicKey as forge.pki.rsa.PublicKey;
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
    <>
      <div className="row qtr-margin-top">
        <div className="col">
          <Panel color="plain" raised={true} padding="loose">
            <div className="row">
              <div className="col">
                <h3>x509 v3 Certificate</h3>
              </div>
            </div>
            <div className="row">
              <div className={displayPem ? "col-6" : "col"}>
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <b>Serial #: </b>
                    <span style={{ fontFamily: "monospace" }}>
                      {props.certObj.serialNumber.toUpperCase()}
                    </span>
                  </li>
                  <li>
                    <b>Signature Type: </b>
                    {signatureType}
                  </li>
                  <li>
                    <b>Subject: </b>
                    {subjectName}
                  </li>
                  <li>
                    <b>Issuer: </b>
                    {issuerName}
                  </li>
                  <li>
                    <b>Valid From: </b>
                    {certObj.validity.notBefore.toString()}
                  </li>
                  <li>
                    <b>Valid To: </b>
                    {certObj.validity.notAfter.toString()}
                  </li>
                  <li>
                    <b>Public Key: </b>
                    {publicKeyType === "rsa" && (
                      <ul style={{ listStyleType: "none" }}>
                        <li>Key Size: {publicKeyInfo.nSize}</li>
                        <li>Modulus:</li>
                        <li>
                          <pre className="qtr-margin-left">
                            {publicKeyInfo.n}
                          </pre>
                        </li>
                        <li>Exponent: {publicKeyInfo.e}</li>
                        <li></li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <b>Extensions:</b>
                    <ul style={{ listStyleType: "none" }}>
                      {certObj.extensions.map((extension, idx) => {
                        return (
                          <li key={idx}>
                            <CertificateExtension
                              extension={extension}
                            ></CertificateExtension>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
              {displayPem && (
                <div className="col-6">
                  <Panel well={true} color="light">
                    <pre>{certPem}</pre>
                  </Panel>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

export default Cert;
