import React, { useEffect, useState } from "react";

import { Label } from "@vkumov/react-cui-2.0";

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
  foo: number;
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

export default CertificateExtension;
