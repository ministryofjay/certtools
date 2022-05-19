import React, { useEffect, useState } from "react";

import { Label } from "@vkumov/react-cui-2.0";
import * as forge from "node-forge";

interface ICertificateExtensionBase {
  id: string;
  critical: boolean;
  value: string;
  name?: string;
}

interface ICertificateExtension {
  extension: ICertificateExtensionBase;
}

function CertificateExtension(props: ICertificateExtension) {
  switch (props.extension.name) {
    case "keyUsage":
      return (
        <CertificateExtensionKeyUsage
          {...(props.extension as ICertificateExtensionKeyUsage)}
        ></CertificateExtensionKeyUsage>
      );
    case "subjectAltName":
      return (
        <CertificateExtensionSubjectAltName
          {...(props.extension as ICertificateExtensionSubjectAltName)}
        ></CertificateExtensionSubjectAltName>
      );
    case "subjectKeyIdentifier":
      return (
        <CertificateExtensionSubjectKeyIdentifier
          {...(props.extension as ICertificateExtensionSubjectKeyIdentifier)}
        ></CertificateExtensionSubjectKeyIdentifier>
      );
    case "authorityKeyIdentifier":
      return (
        <CertificateExtensionAuthorityKeyIdentifier
          {...props.extension}
        ></CertificateExtensionAuthorityKeyIdentifier>
      );
    case "cRLDistributionPoints":
      return (
        <CertificateExtensionCrlDistributionPoints
          {...props.extension}
        ></CertificateExtensionCrlDistributionPoints>
      );
    case "authorityInfoAccess":
      return (
        <CertificateExtensionAuthorityInfoAccess
          {...props.extension}
        ></CertificateExtensionAuthorityInfoAccess>
      );
    default:
      return (
        <>
          {props.extension.name ? props.extension.name : props.extension.id} :{" "}
          {props.extension.value}
        </>
      );
  }
}

interface ICertificateExtensionKeyUsage extends ICertificateExtensionBase {
  cRLSign: boolean;
  dataEncipherment: boolean;
  decipherOnly: boolean;
  digitalSignature: boolean;
  encipherOnly: boolean;
  keyAgreement: boolean;
  keyCertSign: boolean;
  nonRepudiation: boolean;
}
function CertificateExtensionKeyUsage(props: ICertificateExtensionKeyUsage) {
  return (
    <div>
      Key Usage:{" "}
      {Object.entries(props)
        .filter(
          (value) => !["critical", "id", "name", "value"].includes(value[0])
        )
        .filter((value) => value[1])
        .map((value, index) => (
          <Label size="small" key={index} className="qtr-margin-left">
            {value[0]}
          </Label>
        ))}
    </div>
  );
}

interface ICertificateExtensionSubjectAltName
  extends ICertificateExtensionBase {
  altNames: { type: number; value: string }[];
}
function CertificateExtensionSubjectAltName(
  props: ICertificateExtensionSubjectAltName
) {
  return (
    <div>
      <span>Subject Alternate Name:</span>
      <ul>
        {props.altNames.map((altName, index) => {
          return (
            <li key={index}>
              {altName.type === 2 ? "DNS" : "?"} - {altName.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface ICertificateExtensionSubjectKeyIdentifier
  extends ICertificateExtensionBase {
  subjectKeyIdentifier: string;
}
function CertificateExtensionSubjectKeyIdentifier(
  props: ICertificateExtensionSubjectKeyIdentifier
) {
  return (
    <div>
      <span>Subject Key Id: </span>
      <span style={{ fontFamily: "monospace" }}>
        {props.subjectKeyIdentifier.toUpperCase().match(/.{2}/g)?.join(":")}
      </span>
    </div>
  );
}

interface IAiaASN1KeyId {
  composed: boolean;
  constructed: boolean;
  tagClass: number;
  type: number;
  value: string;
}

interface IAsn1Object {
  composed: boolean;
  constructed: boolean;
  tagClass: number;
  type: number;
  value: Array<IAsn1Object> | string;
}

function CertificateExtensionAuthorityKeyIdentifier(
  props: ICertificateExtensionBase
) {
  let keyId = "";
  const asn1Blob = forge.asn1.fromDer(props.value);
  const asn1Object = asn1Blob.value[0] as IAiaASN1KeyId;
  if (asn1Object.type === 0) {
    const sha1Hash = asn1Object.value;
    const hexString = forge.util.bytesToHex(sha1Hash).toUpperCase();
    keyId = hexString.match(/.{2}/g)?.join(":") as string;
  }
  return (
    <div>
      Authority Key Identifier:{" "}
      <span style={{ fontFamily: "monospace" }}>
        {keyId ? `keyId=${keyId}` : "?"}
      </span>{" "}
    </div>
  );
}

function CertificateExtensionCrlDistributionPoints(
  props: ICertificateExtensionBase
) {
  const asn1Blob = forge.asn1.fromDer(props.value) as IAsn1Object;
  const uriBlobs = (
    ((asn1Blob.value as IAsn1Object[])[0].value as IAsn1Object[])[0]
      .value as IAsn1Object[]
  )[0].value as IAsn1Object[];
  const uris = uriBlobs.map((uri) => uri.value);

  return (
    <div>
      <p>CRL Distribution Points:</p>
      <ul>
        {uris.map((uri, index) => {
          return (
            <li key={index}>
              <span style={{ fontFamily: "monospace" }}>
                URI:{uri as string}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CertificateExtensionAuthorityInfoAccess(
  props: ICertificateExtensionBase
) {
  const a = new TextEncoder();
  const asn1Blob = forge.asn1.fromDer(props.value) as IAsn1Object;
  const accessMethods = (asn1Blob.value as IAsn1Object[]).map(
    (accessMethod: IAsn1Object) => {
      const oidArray = a.encode(
        (accessMethod.value as IAsn1Object[])[0].value as string
      );
      const accessLocation = (accessMethod.value as IAsn1Object[])[1]
        .value as string;
      switch (oidArray[oidArray.length - 1]) {
        case 1:
          // OCSP
          return (
            <span>
              OCSP:{" "}
              <span style={{ fontFamily: "monospace" }}>{accessLocation}</span>
            </span>
          );
        case 2:
          return (
            <span>
              Ca Issuers:{" "}
              <span style={{ fontFamily: "monospace" }}>{accessLocation}</span>
            </span>
          );

        // CaIssuers
        default:
          // Unknown
          throw Error("Unknown access method in AIA certificate extension");
      }
    }
  );
  return (
    <>
      <p>Authority Information Access:</p>
      <ul>
        {accessMethods.map((accessMethod, index) => (
          <li key={index}>{accessMethod}</li>
        ))}
      </ul>
    </>
  );
}
export default CertificateExtension;
