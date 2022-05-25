import { Button, Panel, Radios } from "@vkumov/react-cui-2.0";
import React, { useState } from "react";
import * as forge from "node-forge";

interface IExportFile {
  data: string;
  pemHeader?: string;
}

function ExportFile({ data, pemHeader }: IExportFile) {
  const [exportType, setExportType] = useState<string>("PEM");
  const [pemHeaderSelection, setPemHeaderSelection] =
    useState<string>("CERTIFICATE");
  const showPemHeaderSelection = pemHeader === undefined;

  let pemOutput = "";
  if (exportType === "PEM") {
    const pemDump = forge.util.encode64(data, 60);
    pemOutput = `----- BEGIN ${pemHeader || pemHeaderSelection} -----
${pemDump}
----- END ${pemHeader || pemHeaderSelection} -----`;
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <Panel>
            <h3>Export File</h3>
          </Panel>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <Panel>
            <p>Export Type (Text or Binary)</p>
            <Radios
              name="exportType"
              value={exportType}
              values={[
                { value: "PEM", label: "PEM" },
                { value: "DER", label: "DER" },
              ]}
              onChange={(value: string) => setExportType(value)}
            ></Radios>
            {showPemHeaderSelection && exportType === "PEM" && (
              <>
                <p>Data Type (Type of file)</p>
                <Radios
                  name="pemHeaderSelection"
                  value={pemHeaderSelection}
                  values={[
                    { label: "x509 CERTIFICATE", value: "CERTIFICATE" },
                    {
                      label: "CERTIFICATE REQUEST (CSR)",
                      value: "CERTIFICATE REQUEST",
                    },
                  ]}
                  onChange={(value) => {
                    setPemHeaderSelection(value);
                  }}
                ></Radios>
              </>
            )}
          </Panel>
        </div>
        <div className="col-10">
          {exportType === "PEM" && (
            <Panel>
              <pre>{pemOutput}</pre>
            </Panel>
          )}
          {exportType === "DER" && (
            <Panel>
              <div className="text-center">
                <p>Total Bytes: {data.length}</p>
                <Button
                  onClick={async () => {
                    console.log("lets save to a file");
                    const arrayBuffer = new Uint8Array(data.length);
                    for (let i = 0; i < arrayBuffer.length; i++) {
                      arrayBuffer[i] = data.charCodeAt(i);
                    }
                    const fileHandle = await window.showSaveFilePicker();
                    const fileStream = await fileHandle.createWritable();
                    await fileStream.write(new Blob([arrayBuffer]));
                    await fileStream.close();
                  }}
                >
                  Save to File
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

export default ExportFile;
