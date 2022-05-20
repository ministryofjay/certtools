import React, { useEffect, useState } from "react";

import { Panel, Input } from "@vkumov/react-cui-2.0";
import Cert from "./Cert";

import * as forge from "node-forge";
import RSAPrivateKey from "./RSAPrivateKey";
import InputFile from "./InputFile";

const processPkcs12 = (inputBytes: forge.util.ByteBuffer, password: string) => {
  const p12Asn1 = forge.asn1.fromDer(inputBytes.data);
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
  return { privateKey: privateKey, certificateChain: certificateChain };
};

function ExtractPkcs12Tool() {
  const [inputPassword, setInputPassword] = useState<string>("Cisco123");
  const [inputPkcs12Bytes, setInputPkcs12Bytes] =
    useState<forge.util.ByteBuffer>(forge.util.createBuffer(""));

  const [privateKey, setPrivateKey] = useState<forge.pki.PrivateKey>();
  const [certificateChain, setCertificateChain] = useState<
    forge.pki.Certificate[]
  >([]);

  const [inputError, setInputError] = useState<string>("");

  useEffect(() => {
    if (inputPkcs12Bytes.data.length && inputPassword) {
      try {
        const { privateKey, certificateChain } = processPkcs12(
          inputPkcs12Bytes,
          inputPassword
        );
        setPrivateKey(privateKey);
        setCertificateChain(certificateChain);
        setInputError("");
      } catch (e: any) {
        const err = e as Error;
        if (err.message.startsWith("Too few bytes to read ASN.1 value.")) {
          setInputError("Invalid PKCS format");
        }
        setInputError(err.message);
        setPrivateKey(undefined);
        setCertificateChain([]);
      }
    }
  }, [inputPkcs12Bytes, inputPassword]);

  return (
    <Panel>
      <Panel>
        <h2>Open a PKCS12 File</h2>
      </Panel>
      <Panel>
        <InputFile
          allowedFileTypes=".pfx"
          pemHeader="PKCS12"
          onFileLoad={(derInput) => {
            console.log("Got a call back");
            setInputPkcs12Bytes(derInput);
          }}
        ></InputFile>
        <Input
          type="text"
          value={inputPassword}
          label="PKCS12 Password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputPassword(event.target.value);
          }}
        ></Input>
      </Panel>
      <Panel>{inputError && <div>Error {inputError}</div>}</Panel>
      {privateKey !== undefined && certificateChain && (
        <Panel color="light" padding="loose" className="half-margin-top">
          <div className="row">
            <div className="col">
              <h3>Output</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Panel>
                <RSAPrivateKey keyPair={privateKey}></RSAPrivateKey>
              </Panel>
            </div>
          </div>
          {certificateChain.map((cert, idx) => {
            return <Cert certObj={cert} key={idx}></Cert>;
          })}
        </Panel>
      )}
    </Panel>
  );
}

export default ExtractPkcs12Tool;
