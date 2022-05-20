import React, { useEffect, useState } from "react";

import { Radios, Dropzone, Textarea } from "@vkumov/react-cui-2.0";

import * as forge from "node-forge";

const tempStuff = `
-----BEGIN CERTIFICATE-----
MIIF8zCCBNugAwIBAgITHgAAAPZrQ4vzYGYgGwAAAAAA9jANBgkqhkiG9w0BAQsF
ADBsMRMwEQYKCZImiZPyLGQBGRYDY29tMRUwEwYKCZImiZPyLGQBGRYFY2lzY28x
IjAgBgoJkiaJk/IsZAEZFhJqeW91bmd0YS1sYWJkb21haW4xGjAYBgNVBAMTEWp5
b3VuZ3RhLWNhc2VydmVyMB4XDTIxMDQxMzE5MzA0NFoXDTIzMDQxMzE5MzA0NFow
QjEmMCQGCSqGSIb3DQEJAhMXaWRzLXN0YXRpYy04OC5jaXNjby5jb20xGDAWBgNV
BAMTD0pheSBZb3VuZydzIEFTQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAPX3ldcz60DnfafAtZilfzGeDvZvoEnM1khRJoCnTuv50GeqqBNy89dWao7W
WZCw+MDPD7neM4dhHECvUkKjjTQreXUkLYd1o6tqBGA2Mru+ZRKPXt/DTkctZT/1
Dateyfwp4Xzzf5odkryhK8HIooLcBQ6QzCrYPOzjTjBxWG/lXCTWTEO8fQft7Rub
uGC30f+TEbfRmcFJoAZmUlntTqHBtlccwzVQVUsR8br7U1n8mCngL6mlcUNDQmj9
O/CUIqfJOLH/bMYwQfrI8oRA/71KNaLwDCFSFD4eqEq94Jo/frMmHtEzq4dmO+fg
lFkmZBqtotoWDehBVfx5wRMZ4Q8CAwEAAaOCArYwggKyMA4GA1UdDwEB/wQEAwIF
oDAiBgNVHREEGzAZghdpZHMtc3RhdGljLTg4LmNpc2NvLmNvbTAdBgNVHQ4EFgQU
+kPswg59AgeJuYzMhFGX38G2AcEwHwYDVR0jBBgwFoAUy32Ucj5j3VcP8y1rVKun
UuA2SsQwgd4GA1UdHwSB1jCB0zCB0KCBzaCByoZWaHR0cDovL0pZT1VOR1RBLUNB
U0VSVkVSLmp5b3VuZ3RhLWxhYmRvbWFpbi5jaXNjby5jb20vQ2VydEVucm9sbC9q
eW91bmd0YS1jYXNlcnZlci5jcmyGcGxkYXA6Ly8vMTcyLjE4LjEyMy4yMzEvY249
YWRtaW4sZGM9ZGxpYSxkYz1sb2NhbD9jZXJ0aWZpY2F0ZVJldm9jYXRpb25MaXN0
P2Jhc2U/b2JqZWN0Q2xhc3M9Y1JMRGlzdHJpYnV0aW9uUG9pbnQwggEhBggrBgEF
BQcBAQSCARMwggEPMIHEBggrBgEFBQcwAoaBt2xkYXA6Ly8vQ049anlvdW5ndGEt
Y2FzZXJ2ZXIsQ049QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNl
cnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9anlvdW5ndGEtbGFiZG9tYWluLERD
PWNpc2NvLERDPWNvbT9jQUNlcnRpZmljYXRlP2Jhc2U/b2JqZWN0Q2xhc3M9Y2Vy
dGlmaWNhdGlvbkF1dGhvcml0eTBGBggrBgEFBQcwAYY6aHR0cDovL0pZT1VOR1RB
LUNBU0VSVkVSLmp5b3VuZ3RhLWxhYmRvbWFpbi5jaXNjby5jb20vb2NzcDAhBgkr
BgEEAYI3FAIEFB4SAFcAZQBiAFMAZQByAHYAZQByMBMGA1UdJQQMMAoGCCsGAQUF
BwMBMA0GCSqGSIb3DQEBCwUAA4IBAQB8mMBpwuqFb0klOBr3nTgfb+oxjmCCLIeX
rOVgp/cZk/FB8KwwE2Ea+o2MS0q/T/8QmQfwB4EKaLNX+1kyfWutpVR6VkmxPJsh
2yCSMWglKfvKYMKf2ckSVnxDNAJTGxHIYgh9FWHUg0qJK1Ovna8dnGfbvXL1F+lA
xGY+RpPt3ipsWms8KRn4FiGAsEqAbowoqvuKbpKlcbD+Eh+7RJAjspPJ8RIr+Q/M
f17Qt3B4KfUyA34kd0ngP3iOL0fxL7BWcQxrt6GGZfIDuAR+M6VfWFSJ7cWZ3J98
XhsPs1xYdXYh6Cz/AiOdRkq16QwAsA76zUZJFSfyo5W3teFeEgDo
-----END CERTIFICATE-----`;

interface IInputFile {
  allowedFileTypes: string;
  pemHeader?: string;
  onFileLoad: (derInput: forge.util.ByteBuffer) => void;
}

function InputFile(props: IInputFile) {
  const [inputType, setInputType] = useState<string>("PEM");

  const [pemInput, setPemInput] = useState<string>(tempStuff);
  const [pemInputError, setPemInputError] = useState<string>("");

  const [derInput, setDerInput] = useState<forge.util.ByteBuffer>();
  const [derInputError, setDerInputError] = useState<string>();

  const processPemText = (inputString: string) => {
    const pemRegex =
      /^\s*(-----BEGIN \w+-----)?\s*(?<b64String>[\s\nA-Za-z0-9/+=]+)\s*(-----END \w+-----)?\s*$/;

    // Basic validation of input is a valid PEM data
    const validInput = pemRegex.exec(inputString);
    if (validInput) {
      const b64DecodedString = forge.util.decode64(
        validInput?.groups?.b64String as string
      );
      const binaryArray = new forge.util.ByteStringBuffer(b64DecodedString);
      try {
        forge.asn1.fromDer(binaryArray);
        setDerInput(binaryArray);
        setPemInputError("");
        setDerInputError("");
      } catch (error: any) {
        setPemInputError(error.message);
      }
    } else {
      setPemInputError("This is not valid PEM data");
    }
  };

  useEffect(() => {
    if (derInput?.length) {
      // Execute the call back with the loaded/decoded byte array
      props.onFileLoad(derInput);
    }
  }, [props, derInput]);

  return (
    <>
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
                  (pemInputError ? "form-group--error" : "")
                }
              >
                <Textarea
                  rows={20}
                  value={pemInput}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDerInput(undefined);
                    processPemText(e.target.value);
                    setPemInput(e.target.value);
                  }}
                  label="Enter the PKCS12 PEM Encoded Text"
                  placeholder={`-----BEGIN ${props.pemHeader || "XXXX"}-----
MIIWlwIBAzCCFl0GCSqGSIb3DQEHAaCCFk4EghZKMIIWRjCCELcGCSqGSIb3DQEH
BqCCEKgwghCkAgEAMIIQnQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQMwDgQIQgHv
...
...
Joe80cjh+4nlr3v5mmfkAB1RgqP7vUKKDPbWWJGCBXAsdWXjoiwi6HDfOwVq8J8K
55wFOTk3t4jC2CQWnsnP/1LoOvZhyAfiMDEwITAJBgUrDgMCGgUABBQZxQ5djdkA
Blnl9YxnnqYuRF1HFgQI+rXFej+yTooCAggA
-----END ${props.pemHeader || "XXXX"}-----

                  `}
                ></Textarea>
                {pemInputError && (
                  <div className="help-block" role="alert">
                    <span>{pemInputError}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Dropzone
              name="Upload file"
              label="Binary (DER) File"
              multiple={false}
              onChange={async (files) => {
                setPemInput("");
                if (files.length) {
                  const readFileContents = async (file: File) => {
                    return new Promise<forge.util.ByteBuffer>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = (event) => {
                        const a = new forge.util.ByteStringBuffer(
                          event.target?.result as ArrayBuffer
                        );
                        resolve(a);
                      };
                      reader.readAsArrayBuffer(file);
                    });
                  };
                  const fileContents = await readFileContents(files[0]);
                  try {
                    forge.asn1.fromDer(fileContents);
                    setDerInput(fileContents);
                    setDerInputError("");
                  } catch (error: any) {
                    setDerInputError(error.message);
                  }
                }
              }}
              accept={props.allowedFileTypes}
              validator={(file) => {
                console.log("validate file", file);
                return null;
              }}
              error={derInputError}
            ></Dropzone>
          )}
        </div>
      </div>
      <div>Total decoded bytes: {derInput?.data.length}</div>
    </>
  );
}

export default InputFile;
