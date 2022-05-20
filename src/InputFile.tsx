import React, { useEffect, useState } from "react";

import { Radios, Dropzone, Textarea } from "@vkumov/react-cui-2.0";

import * as forge from "node-forge";

interface IInputFile {
  allowedFileTypes: string;
  pemHeader?: string;
  onFileLoad: (derInput: forge.util.ByteBuffer) => void;
}

function InputFile({ allowedFileTypes, pemHeader, onFileLoad }: IInputFile) {
  const [inputType, setInputType] = useState<string>("PEM");

  const [pemInput, setPemInput] = useState<string>("");
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
      try {
        onFileLoad(derInput);
      } catch (err) {
        console.log("Call back from InputFile failed with Error", err);
      }
    }
  }, [onFileLoad, derInput]);

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
                  label="Enter the PEM Encoded Text"
                  placeholder={`-----BEGIN ${pemHeader || "XXXX"}-----
MIIWlwIBAzCCFl0GCSqGSIb3DQEHAaCCFk4EghZKMIIWRjCCELcGCSqGSIb3DQEH
BqCCEKgwghCkAgEAMIIQnQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQMwDgQIQgHv
...
...
Joe80cjh+4nlr3v5mmfkAB1RgqP7vUKKDPbWWJGCBXAsdWXjoiwi6HDfOwVq8J8K
55wFOTk3t4jC2CQWnsnP/1LoOvZhyAfiMDEwITAJBgUrDgMCGgUABBQZxQ5djdkA
Blnl9YxnnqYuRF1HFgQI+rXFej+yTooCAggA
-----END ${pemHeader || "XXXX"}-----

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
              accept={allowedFileTypes}
              validator={(file) => {
                const allowedExtensions = allowedFileTypes.split(",");
                const validExtension = allowedExtensions.some((extension) =>
                  file.name.endsWith(extension)
                );
                if (validExtension) {
                  return null;
                } else {
                  return {
                    code: "not-valid-extension",
                    message: `file "${file.name}" doesn't have any of the following extensions ${allowedFileTypes}`,
                  };
                }
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
