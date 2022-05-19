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
  switch (props.extension.id) {
    case "1.3.6.1.4.1.311.20.2":
      props.extension.name = "certEnrollmentType";
      break;
    case "1.3.6.1.4.1.311.21.1":
      props.extension.name = "msCertificateServicesCaVersion";
      break;
  }

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
    case "certEnrollmentType":
      return (
        <CertificateExtensionEnrollmentCertType
          {...props.extension}
        ></CertificateExtensionEnrollmentCertType>
      );
    case "extKeyUsage":
      return (
        <CertificateExtensionExtendedKeyUsage
          {...props.extension}
        ></CertificateExtensionExtendedKeyUsage>
      );
    case "basicConstraints":
      return (
        <CertificateExtensionBasicConstraints
          {...(props.extension as ICertificateExtensionBasicConstraints)}
        ></CertificateExtensionBasicConstraints>
      );
    case "msCertificateServicesCaVersion":
      return (
        <CertificateExtensionMsCertificateServicesCaVersion
          {...props.extension}
        ></CertificateExtensionMsCertificateServicesCaVersion>
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
          <Label size="tiny" key={index} className="qtr-margin-left">
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
      <ul style={{ listStyleType: "none" }}>
        {props.altNames.map((altName, index) => {
          return (
            <li key={index}>
              <span style={{ fontFamily: "monospace" }}>
                {altName.type === 2 ? "DNS" : "?"}: {altName.value}
              </span>
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
  const asn1Object = asn1Blob.value[0] as IAsn1Object;
  if (asn1Object.type === 0) {
    const sha1Hash = asn1Object.value as string;
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
      CRL Distribution Points:
      <ul style={{ listStyleType: "none" }}>
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
              CA Issuers:{" "}
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
      Authority Information Access:
      <ul style={{ listStyleType: "none" }}>
        {accessMethods.map((accessMethod, index) => (
          <li key={index}>{accessMethod}</li>
        ))}
      </ul>
    </>
  );
}

function CertificateExtensionEnrollmentCertType(
  props: ICertificateExtensionBase
) {
  const asn1Blob = forge.asn1.fromDer(props.value);
  return <div>Certificate Template: {asn1Blob.value as string}</div>;
}

interface ICertificateExtensionExtendedKeyUsage
  extends ICertificateExtensionBase {
  serverAuth?: boolean;
  clientAuth?: boolean;
  codeSigning?: boolean;
  emailProtection?: boolean;
  timeStamping?: boolean;
}

function CertificateExtensionExtendedKeyUsage(
  props: ICertificateExtensionExtendedKeyUsage
) {
  // The forge function that parses extKeyUsage will only put 'true' usages on the object
  const extKeyUsages = Object.keys(props)
    .filter((key) => !["critical", "id", "name", "value"].includes(key))
    .map((key, index) => (
      <Label size="tiny" key={index} className="qtr-margin-left">
        {key}
      </Label>
    ));

  return <div>Extended Key Usages: {extKeyUsages}</div>;
}

interface ICertificateExtensionBasicConstraints
  extends ICertificateExtensionBase {
  cA: boolean;
  pathLenConstraint?: number;
}
function CertificateExtensionBasicConstraints(
  props: ICertificateExtensionBasicConstraints
) {
  return (
    <div>
      Basic Constraints:
      <ul style={{ listStyleType: "none" }}>
        <li>CA: {props.cA ? "True" : "False"}</li>
        {props.pathLenConstraint !== undefined && (
          <li>Path Length Constraint: {props.pathLenConstraint}</li>
        )}
      </ul>
    </div>
  );
}

function CertificateExtensionMsCertificateServicesCaVersion(
  props: ICertificateExtensionBase
) {
  const textEncoder = new TextEncoder();
  const versionArray = textEncoder.encode(props.value);
  const versionArrayString = [];
  versionArray.forEach((int) => {
    versionArrayString.push(int.toString());
  });
  return <div>MS CA Version: {versionArray.join(".")}</div>;
}
export default CertificateExtension;
