import React, { useCallback, useEffect, useState } from "react";

import {
  Panel,
  Input,
  Radios,
  Dropdown,
  DropdownElement,
  Icon,
  EditableSelect,
} from "@vkumov/react-cui-2.0";

import * as forge from "node-forge";
import RSAPrivateKey from "./RSAPrivateKey";
import InputFile from "./InputFile";
import Csr from "./Csr";

const signatureAlgorithms: { [key: string]: any } = {
  MD5: forge.md.md5,
  "SHA 1": forge.md.sha1,
  "SHA 2 (256)": forge.md.sha256,
  "SHA 2 (384)": forge.md.sha384,
  "SHA 2 (512)": forge.md.sha512,
};

function GenerateCsr() {
  const [keyPairOption, setKeyPairOption] = useState<string>("generate");
  const [keyPair, setKeyPair] = useState<forge.pki.rsa.KeyPair>();
  const [desiredKeyPairSize, setDesiredKeyPairSize] = useState<number>(2048);
  const [csrObject, setCsrObject] = useState(
    forge.pki.createCertificationRequest()
  );
  const [subjectAttributes, setSubjectAttributes] = useState<
    [string, string][]
  >([]);
  const [signatureAlgorithm, setSignatureAlgorithm] = useState<string>("SHA 1");

  useEffect(() => {
    // Generate a RSA private key immediately
    const callback = (err: Error, keypair: forge.pki.rsa.KeyPair) => {
      if (err) {
        throw new Error("oh shit");
      } else {
        setKeyPair(keypair);
      }
    };
    forge.pki.rsa.generateKeyPair(desiredKeyPairSize, 65537, callback);
  }, [desiredKeyPairSize]);

  useEffect(() => {
    if (keyPair && keyPair.publicKey !== csrObject.publicKey) {
      const newCsrObject = Object.assign({}, csrObject);
      newCsrObject.publicKey = keyPair.publicKey;
      setCsrObject(newCsrObject);
    }
  }, [csrObject, keyPair]);

  useEffect(() => {
    if (csrObject.subject.attributes.length !== subjectAttributes.length) {
      const newCsrObject = Object.assign({}, csrObject);
      newCsrObject.subject.attributes = [];
      for (let attribute of subjectAttributes) {
        newCsrObject.subject.addField({
          type: forge.pki.oids[attribute[0]],
          value: attribute[1],
        });
      }
      setCsrObject(newCsrObject);
    }
  }, [csrObject, subjectAttributes]);

  useEffect(() => {
    if (keyPair) {
      // Copied the library function and defining locally to avoid
      // a variable closure issue.  When we 'clone' the csr object
      // the .sign function attached to the object uses the closure of
      // the original 'csr'.  So had to modify the function to use the correct
      // csr.
      const signMe = (csr: any, key: any, md: forge.md.MessageDigest) => {
        // TODO: get signature OID from private key
        csr.md = md || forge.md.sha1.create();
        var algorithmOid =
          forge.pki.oids[csr.md.algorithm + "WithRSAEncryption"];
        if (!algorithmOid) {
          var error = new Error(
            "Could not compute certification request digest. " +
              "Unknown message digest algorithm OID."
          );
          throw error;
        }
        csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;

        // get CertificationRequestInfo, convert to DER
        // @ts-ignore
        // prettier-ignore
        csr.certificationRequestInfo = forge.pki.getCertificationRequestInfo(csr);
        var bytes = forge.asn1.toDer(csr.certificationRequestInfo);

        // digest and sign
        csr.md.update(bytes.getBytes());
        csr.signature = key.sign(csr.md);
      };

      const newCsrObject = Object.assign({}, csrObject);
      try {
        const md = signatureAlgorithms[signatureAlgorithm];
        signMe(newCsrObject, keyPair.privateKey, md.create());
        if (csrObject.signature !== newCsrObject.signature) {
          // Signature has changed
          setCsrObject(newCsrObject);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [keyPair, csrObject, signatureAlgorithm]);

  const keyInputCallback = useCallback((derInput: forge.util.ByteBuffer) => {
    const asn1Blob = forge.asn1.fromDer(derInput.data);
    const newPrivateKey = forge.pki.privateKeyFromAsn1(
      asn1Blob
    ) as forge.pki.rsa.PrivateKey;
    const newPublicKey: forge.pki.rsa.PublicKey = {
      e: newPrivateKey.e,
      n: newPrivateKey.n,
      encrypt: () => {
        throw Error("Fake public key");
      },
      verify: () => {
        throw Error("Fake public key");
      },
    };
    const newKeyPair: forge.pki.KeyPair = {
      privateKey: newPrivateKey,
      publicKey: newPublicKey,
    };
    // @ts-ignore
    setKeyPair(newKeyPair);
  }, []);

  const [newAttributeType, setNewAttributeType] = useState<string>("");
  const [newAttributeValue, setNewAttributeValue] = useState<string>("");
  const selectableAttributes = [
    "commonName",
    "countryName",
    "localityName",
    "stateOrProvinceName",
    "organizationName",
    "organizationalUnitName",
    "emailAddress",
  ];

  return (
    <>
      <div className="row">
        <div className="col">
          <Panel>
            <h2>Generate a Certificate Signing Request (CSR)</h2>
          </Panel>
          <Panel>
            <h4>RSA Key Pair</h4>
            <Panel raised={true}>
              <div className="row">
                <div className="col-2">
                  <Radios
                    name="keyPairOption"
                    value={keyPairOption}
                    values={[
                      { value: "generate", label: "Generate a new key" },
                      { value: "import", label: "Import a key" },
                    ]}
                    onChange={(value: string) => setKeyPairOption(value)}
                  ></Radios>
                </div>
                <div className="col">
                  {keyPairOption === "generate" && (
                    <>
                      <Dropdown header={"RSA key size"} alwaysClose={true}>
                        {[512, 768, 1024, 2048, 4096].map((value, index) => (
                          <DropdownElement
                            key={index}
                            onClick={() => {
                              setDesiredKeyPairSize(value);
                            }}
                          >
                            {value}
                          </DropdownElement>
                        ))}
                      </Dropdown>
                    </>
                  )}
                  {keyPairOption === "import" && (
                    <>
                      <InputFile
                        allowedFileTypes=""
                        pemHeader="RSA PRIVATE KEY"
                        onFileLoad={keyInputCallback}
                      ></InputFile>
                    </>
                  )}
                </div>
              </div>
            </Panel>
            <Panel raised={true} className="qtr-margin-top">
              <div className="row">
                <div className="col">
                  {keyPair && (
                    <RSAPrivateKey keyPair={keyPair.privateKey}></RSAPrivateKey>
                  )}
                </div>
              </div>
            </Panel>
            <Panel raised={true} className="qtr-margin-top">
              <div className="row">
                <div className="col">
                  <h4>Subject Information</h4>
                  <table>
                    <thead></thead>
                    <tbody>
                      {subjectAttributes.map((attr, index: number) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span className="qtr-margin-left">{attr[0]}</span>
                            </td>
                            <td>{attr[1]}</td>
                            <td>
                              <Icon
                                icon="delete"
                                onClick={() => {
                                  console.log("ccc");
                                  const newAttributes = [...subjectAttributes];
                                  newAttributes.splice(index, 1);
                                  setSubjectAttributes(newAttributes);
                                }}
                              ></Icon>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>
                          <EditableSelect
                            displayValues={true}
                            multiple={false}
                            inline={true}
                            options={selectableAttributes.map(
                              (attributeName) => {
                                return {
                                  label: attributeName,
                                  value: attributeName,
                                };
                              }
                            )}
                            value={newAttributeType}
                            onChange={(value) => {
                              setNewAttributeType(value);
                            }}
                          ></EditableSelect>
                        </td>
                        <td>
                          <Input
                            value={newAttributeValue}
                            onKeyUp={(
                              event: React.KeyboardEvent<HTMLInputElement>
                            ) => {
                              setNewAttributeValue(
                                (event.target as HTMLInputElement).value
                              );
                            }}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewAttributeValue(event.target.value);
                            }}
                            size={50}
                          ></Input>
                        </td>
                        <td>
                          <Icon
                            icon="plus"
                            onClick={() => {
                              if (newAttributeType && newAttributeValue) {
                                const newAttributes = [...subjectAttributes];
                                newAttributes.push([
                                  newAttributeType,
                                  newAttributeValue,
                                ]);
                                setSubjectAttributes(newAttributes);
                                setNewAttributeType("");
                                setNewAttributeValue("");
                              }
                            }}
                          ></Icon>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col">
                  <h4>Signature Algorithm</h4>
                  <Dropdown header={signatureAlgorithm} alwaysClose={true}>
                    {[
                      "MD5",
                      "SHA 1",
                      "SHA 2 (256)",
                      "SHA 2 (384)",
                      "SHA 2 (512)",
                    ].map((algo, index) => (
                      <DropdownElement
                        key={index}
                        onClick={() => {
                          setSignatureAlgorithm(algo);
                        }}
                      >
                        {algo}
                      </DropdownElement>
                    ))}
                  </Dropdown>
                </div>
              </div>
            </Panel>
            <Csr csr={csrObject}></Csr>
          </Panel>
        </div>
      </div>
    </>
  );
}

export default GenerateCsr;
