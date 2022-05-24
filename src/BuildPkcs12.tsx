import { Button, Icon, Panel } from "@vkumov/react-cui-2.0";
import React, { useEffect, useState } from "react";
import * as forge from "node-forge";

import { Buffer } from "buffer";

import { Textarea, Input } from "@vkumov/react-cui-2.0";

import RSAPrivateKey, { privateKeyDetails } from "./RSAPrivateKey";
import Cert from "./Cert";

function BuildPkcs12() {
  const [pemKeyInput, setPemKeyInput] = useState<string>("");
  const [pemKeyInputError, setPemKeyInputError] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<forge.pki.PrivateKey>();
  const [numberOfCerts, setNumberOfCerts] = useState<number>(1);
  const [certArray, setCertArray] = useState<
    (forge.pki.Certificate | undefined)[]
  >([undefined]);

  useEffect(() => {
    if (pemKeyInput) {
      try {
        const pKey = forge.pki.privateKeyFromPem(pemKeyInput);
        setPrivateKey(pKey);
        setPemKeyInputError("");
      } catch (error: any) {
        setPemKeyInputError(error.message);
      }
    } else {
      setPemKeyInputError("");
      setPrivateKey(undefined);
    }
  }, [pemKeyInput]);

  useEffect(() => {
    // Grow/Strink cert array based on + or - chain length
    const newCertArray = certArray.slice(0, numberOfCerts);
    if (newCertArray.length < numberOfCerts) {
      setCertArray(newCertArray.concat([undefined]));
    } else {
      if (newCertArray.length !== certArray.length) {
        setCertArray(newCertArray);
      }
    }
  }, [numberOfCerts, certArray]);

  let privateKeyModulus = "";
  if (privateKey) {
    const { modulus } = privateKeyDetails(
      privateKey as forge.pki.rsa.PrivateKey
    );
    privateKeyModulus = modulus;
  }

  let idCertificateModulus = "";
  if (certArray[0]) {
    idCertificateModulus = Buffer.from(
      (certArray[0].publicKey as forge.pki.rsa.PublicKey).n.toByteArray()
    )
      .toString("hex")
      .toUpperCase();
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <Panel>
            <h2>Build PKCS12 File</h2>
          </Panel>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <Panel>
            <Textarea
              rows={20}
              error={pemKeyInputError}
              value={pemKeyInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPemKeyInput(e.target.value);
              }}
              label="Enter the PEM RSA Private Key"
              placeholder={`-----BEGIN PRIVATE KEY-----
MIIWlwIBAzCCFl0GCSqGSIb3DQEHAaCCFk4EghZKMIIWRjCCELcGCSqGSIb3DQEH
BqCCEKgwghCkAgEAMIIQnQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQMwDgQIQgHv
...
...
Joe80cjh+4nlr3v5mmfkAB1RgqP7vUKKDPbWWJGCBXAsdWXjoiwi6HDfOwVq8J8K
55wFOTk3t4jC2CQWnsnP/1LoOvZhyAfiMDEwITAJBgUrDgMCGgUABBQZxQ5djdkA
Blnl9YxnnqYuRF1HFgQI+rXFej+yTooCAggA
-----END PRIVATE KEY-----

                  `}
            ></Textarea>
          </Panel>
        </div>
        <div className="col-6">
          {privateKey && (
            <RSAPrivateKey
              keyPair={privateKey}
              displayPem={false}
            ></RSAPrivateKey>
          )}
        </div>
      </div>
      {privateKeyModulus && idCertificateModulus && (
        <div className="row base-margin-top">
          <div className="col">
            <Panel
              raised={true}
              color={
                privateKeyModulus === idCertificateModulus
                  ? "success"
                  : "danger"
              }
            >
              <div className="text-center">
                {privateKeyModulus === idCertificateModulus ? (
                  <span>Good</span>
                ) : (
                  <span>bad</span>
                )}
              </div>
            </Panel>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="clearfix">
                <Panel className="pull-right" padding="loose">
                  <Icon
                    size={24}
                    icon="add"
                    onClick={(event) => {
                      console.log(event);
                      setNumberOfCerts(numberOfCerts + 1);
                    }}
                  ></Icon>
                </Panel>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {[...Array(numberOfCerts).keys()].map((certNumber) => {
                return (
                  <Panel key={certNumber}>
                    {certNumber > 0 && certNumber + 1 === numberOfCerts && (
                      <div className="row">
                        <div className="col">
                          <Panel className="pull-right" padding="loose">
                            <Icon
                              size={24}
                              icon="delete"
                              onClick={() => {
                                setNumberOfCerts(numberOfCerts - 1);
                              }}
                            ></Icon>
                          </Panel>
                        </div>
                      </div>
                    )}
                    <InputCert
                      onValid={(certObj: forge.pki.Certificate) => {
                        const newCertArray = certArray.slice();
                        newCertArray[certNumber] = certObj;
                        setCertArray(newCertArray);
                      }}
                    ></InputCert>
                  </Panel>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface IInputCert {
  onValid: (certObj: forge.pki.Certificate) => void;
}
export function InputCert(props: IInputCert) {
  const [cert, setCert] = useState<forge.pki.Certificate>();
  const [pemInput, setPemInput] = useState<string>();
  const [pemInputError, setPemInputError] = useState<string>();

  useEffect(() => {
    if (pemInput) {
      try {
        const certObj = forge.pki.certificateFromPem(pemInput);
        setCert(certObj);
        setPemInputError("");
        props.onValid(certObj);
      } catch (error: any) {
        setPemInputError(error.message);
      }
    } else {
      setCert(undefined);
    }
  }, [pemInput]);

  return (
    <>
      <div className="row">
        <div className="col-6">
          <Textarea
            rows={20}
            error={pemInputError}
            value={pemInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setPemInput(e.target.value);
            }}
            label="Enter the PEM Encoded certificate"
            placeholder={`-----BEGIN CERTIFICATE-----
MIIWlwIBAzCCFl0GCSqGSIb3DQEHAaCCFk4EghZKMIIWRjCCELcGCSqGSIb3DQEH
BqCCEKgwghCkAgEAMIIQnQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQMwDgQIQgHv
...
...
Joe80cjh+4nlr3v5mmfkAB1RgqP7vUKKDPbWWJGCBXAsdWXjoiwi6HDfOwVq8J8K
55wFOTk3t4jC2CQWnsnP/1LoOvZhyAfiMDEwITAJBgUrDgMCGgUABBQZxQ5djdkA
Blnl9YxnnqYuRF1HFgQI+rXFej+yTooCAggA
-----END CERTIFICATE-----
                  `}
          ></Textarea>
        </div>
        <div className="col-6">
          {cert && <Cert certObj={cert} displayPem={false}></Cert>}
        </div>
      </div>
    </>
  );
}

export default BuildPkcs12;
