import React, { useEffect, useState } from "react";

import {
  Radios,
  Dropzone,
  Panel,
  Input,
  Textarea,
} from "@vkumov/react-cui-2.0";
import Cert from "./Cert";

import * as forge from "node-forge";

const examplePkcs12Pem = `
-----BEGIN PKCS12-----
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
Blnl9YxnnqYuRF1HFgQI+rXFej+yTooCAggA
-----END PKCS12-----
`;

const processPkcs12 = (
  inputBytes: string | forge.util.ByteBuffer,
  password: string
) => {
  const p12Asn1 = forge.asn1.fromDer(inputBytes);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
  const keyBags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  });
  const privateKeyBags = keyBags[
    forge.pki.oids.pkcs8ShroudedKeyBag
  ] as forge.pkcs12.Bag[];
  if (privateKeyBags.length !== 1) {
    throw new Error("No private key found in the pkcs12");
  }
  const privateKey = privateKeyBags[0].key as forge.pki.PrivateKey;
  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const certificateChainBags = p12.getBags({
    bagType: forge.pki.oids.certBag,
  });

  const certHashes = new Set();
  // Some PKCS12 have the leaf (identity) cert twice in the chain
  // Filter out the duplicate certificates
  const certBags = certificateChainBags[
    forge.pki.oids.certBag
  ] as forge.pkcs12.Bag[];
  const certificateChain = certBags
    .map((bag: any) => bag.cert as forge.pki.Certificate)
    .filter((certObj: any) => {
      const certDer = forge.asn1
        .toDer(forge.pki.certificateToAsn1(certObj))
        .getBytes();
      const md = forge.md.sha1.create();
      md.update(certDer);
      const certShaHash = md.digest().toHex();
      if (certHashes.has(certShaHash)) {
        return false;
      } else {
        certHashes.add(certShaHash);
        return true;
      }
    });
  return { privateKey: privateKeyPem, certificateChain: certificateChain };
};

function ExtractPkcs12Tool() {
  const [inputType, setInputType] = useState<string>("PEM");

  const [inputPassword, setInputPassword] = useState<string>("Cisco123");
  const [inputPkcs12Pem, setInputPkcs12Pem] =
    useState<string>(examplePkcs12Pem);
  const [inputPkcs12PemErrorText, setInputPkcs12PemErrorText] =
    useState<string>("");
  const [inputPkcs12Bytes, setInputPkcs12Bytes] = useState<
    string | forge.util.ByteBuffer
  >("");

  const [privateKey, setPrivateKey] = useState<string>("");
  const [certificateChain, setCertificateChain] = useState<
    forge.pki.Certificate[]
  >([]);

  const [dropZoneError, setDropZoneError] = useState<string>("");

  const processInputPkcs12Pem = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputPkcs12Pem(event.target.value);
    const pemRegex =
      /^\s*(-----BEGIN PKCS12-----)?\s*(?<b64String>[\s\nA-Za-z0-9/+=]+)\s*(-----END PKCS12-----)?\s*$/;

    // Basic validation of input is a valid PEM data
    const validInput = pemRegex.exec(event.target.value);
    if (validInput) {
      console.log("Woot");
      setInputPkcs12PemErrorText("");
      // Get just pure base64 string
      const p12B64 = validInput?.groups?.b64String.replace(
        /[\s\n]*/g,
        ""
      ) as string;
      setInputPkcs12Bytes(forge.util.decode64(p12B64));
    } else {
      setInputPkcs12PemErrorText("Invalid PKCS12");
      setInputPkcs12Bytes("");
    }
  };

  useEffect(() => {
    if (inputPkcs12Bytes && inputPassword) {
      const { privateKey, certificateChain } = processPkcs12(
        inputPkcs12Bytes,
        inputPassword
      );
      setPrivateKey(privateKey);
      setCertificateChain(certificateChain);
    }
  }, [inputPkcs12Bytes, inputPassword]);

  const bytesLength =
    typeof inputPkcs12Bytes === "string"
      ? inputPkcs12Bytes.length
      : inputPkcs12Bytes.data.length;

  return (
    <Panel>
      <Panel>
        <h1>Open a PKCS12 File</h1>
      </Panel>
      <Panel
        bordered={true}
        raised={true}
        color="lightest"
        padding="loose"
        className="half-margin-top"
      >
        <div className="row">
          <div className="col">
            <h3>Input File</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="panel">
              {
                <Radios
                  name="inputType"
                  value={inputType}
                  values={[
                    { value: "PEM", label: "PEM" },
                    { value: "DER", label: "DER" },
                  ]}
                  onChange={(value: string) => {
                    setInputType(value);
                  }}
                ></Radios>
              }
            </div>
          </div>
          <div className="col-10">
            {inputType === "PEM" ? (
              <div>
                <div
                  className={
                    "form-group base-margin-bottom " +
                    (inputPkcs12PemErrorText ? "form-group--error" : "")
                  }
                >
                  <Textarea
                    rows={20}
                    value={inputPkcs12Pem}
                    onChange={processInputPkcs12Pem}
                    label="Enter the PKCS12 PEM Encoded Text"
                    placeholder="foo"
                  ></Textarea>
                  {inputPkcs12PemErrorText && (
                    <div className="help-block" role="alert">
                      <span>{inputPkcs12PemErrorText}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Dropzone
                name="Upload PKCS12 (.pfx) file"
                label="Binary (DER) File"
                multiple={false}
                onChange={async (files) => {
                  if (files.length) {
                    const readFileContents = async (file: File) => {
                      return new Promise<forge.util.ByteBuffer>(
                        (resolve, reject) => {
                          const reader = new FileReader();
                          reader.onloadend = (event) => {
                            console.log("finished reading");
                            const a = new forge.util.ByteStringBuffer(
                              event.target?.result as ArrayBuffer
                            );
                            resolve(a);
                          };
                          reader.readAsArrayBuffer(file);
                        }
                      );
                    };
                    const fileContents = await readFileContents(files[0]);
                    setInputPkcs12Bytes(fileContents);
                  }
                }}
                accept=".pfx"
                validator={(file) => {
                  if (file.name.endsWith(".pfx")) {
                    setDropZoneError("");
                    return null;
                  } else {
                    setDropZoneError("Not a .pfx file");
                    return {
                      code: "not-a-pfx",
                      message: `Not a Pfx file.`,
                    };
                  }
                }}
                error={dropZoneError}
              ></Dropzone>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              label="PKCS12 Password"
              type="text"
              value={inputPassword}
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                setInputPassword(target.value);
              }}
            ></Input>
          </div>
        </div>
        <div className="row">
          <div className="col">PKCS12 {bytesLength} length</div>
        </div>
      </Panel>
      <Panel color="light" padding="loose" className="half-margin-top">
        <div className="row">
          <div className="col">
            <h3>Output</h3>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Panel>
              <p>Private Key</p>
              <pre>{privateKey}</pre>
            </Panel>
          </div>
        </div>
        {certificateChain.map((cert, idx) => {
          return <Cert certObj={cert} key={idx}></Cert>;
        })}
      </Panel>
    </Panel>
  );
}

export default ExtractPkcs12Tool;
