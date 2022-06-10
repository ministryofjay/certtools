import React, { useCallback, useEffect, useState } from "react";

import {
  Panel,
  Input,
  Radios,
  Dropdown,
  DropdownElement,
  Menu,
  Icon,
  EditableSelect,
  Option,
} from "@vkumov/react-cui-2.0";
import { Buffer } from "buffer";

import Cert from "./Cert";

import * as forge from "node-forge";
import RSAPrivateKey from "./RSAPrivateKey";
import InputFile from "./InputFile";
import Csr from "./Csr";
import { OperationCanceledException } from "typescript";

function GenerateCsr() {
  const [keyPairOption, setKeyPairOption] = useState<string>("generate");
  const [keyPair, setKeyPair] = useState<forge.pki.rsa.KeyPair>();
  const [desiredKeyPairSize, setDesiredKeyPairSize] = useState<number>(2048);
  const [csrObject, setCsrObject] = useState(
    forge.pki.createCertificationRequest()
  );
  const [subjectAttributes, setSubjectAttributes] = useState<
    [string, string][]
  >([
    ["commonName", "jyoungta"],
    ["countryName", "US"],
  ]);

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
                <div className="col">
                  <Radios
                    name="keyPairOption"
                    value={keyPairOption}
                    values={[
                      /*{ value: "import", label: "Import a key" }, */
                      { value: "generate", label: "Generate a new key" },
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
                            data-key-size={value}
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
              </div>
            </Panel>
            <Csr csr={csrObject}></Csr>
          </Panel>
        </div>
      </div>
    </>
  );
}

/*
Certificate Request:
    Data:
        Version: 0 (0x0)
        Subject: C=US, ST=NC, L=RTP, O=Cisco, OU=CX, CN=jyoungta-webserver.cisco.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:e0:39:f7:d9:85:80:bc:ae:0d:a2:2e:7d:13:2b:
                    59:e4:1c:0e:89:55:cb:97:a7:07:78:b5:20:78:77:
                    00:64:4b:54:f5:5b:29:ea:76:47:31:a0:2b:4c:aa:
                    e4:2e:90:eb:f1:77:70:40:8f:84:76:a9:83:77:ff:
                    62:da:a0:ce:82:43:8e:4e:c5:3d:4a:dc:c2:fa:f4:
                    63:03:2d:68:f0:a6:b2:6d:4a:8f:e0:18:74:7b:57:
                    40:7a:17:c0:1e:0e:b1:5c:74:47:0c:58:af:e4:a0:
                    e5:06:c3:da:a7:23:ed:92:cc:47:6e:04:f6:d6:ca:
                    d8:56:a1:67:7c:98:af:e6:c5:b5:96:00:12:c7:37:
                    d1:c7:0f:76:1d:ca:54:32:29:20:9b:b3:01:87:f0:
                    ce:28:2b:1e:21:38:5e:06:6a:c3:d4:01:ce:86:2b:
                    c9:49:07:c8:2e:a3:74:ad:de:1f:b3:20:8b:38:78:
                    18:4f:47:f2:29:cf:98:a2:8f:5b:b4:aa:7d:46:71:
                    c1:6c:e0:fa:52:c1:f2:e6:b3:02:fc:04:b1:e2:a7:
                    92:cd:a4:74:f8:96:80:ed:23:b7:7d:2c:d3:e8:ab:
                    64:0b:a4:02:48:8b:66:7e:34:65:56:79:f2:4e:b0:
                    30:74:33:46:78:d3:01:a1:61:ee:89:3c:97:41:1e:
                    0f:3d
                Exponent: 65537 (0x10001)
        Attributes:
            a0:00
*/

export default GenerateCsr;
