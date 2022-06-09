import React, { useEffect, useState } from "react";

import Csr from "./Csr";
import {
  Panel,
  Input,
  Radios,
  Dropdown,
  DropdownElement,
  Menu,
} from "@vkumov/react-cui-2.0";
import { Buffer } from "buffer";

import * as forge from "node-forge";

function ViewCsr() {
  const csr = forge.pki.certificationRequestFromPem(`
  -----BEGIN CERTIFICATE REQUEST-----
MIICsTCCAZkCAQAwbDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAk5DMQwwCgYDVQQH
DANSVFAxDjAMBgNVBAoMBUNpc2NvMQswCQYDVQQLDAJDWDElMCMGA1UEAwwcanlv
dW5ndGEtd2Vic2VydmVyLmNpc2NvLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBAOA599mFgLyuDaIufRMrWeQcDolVy5enB3i1IHh3AGRLVPVbKep2
RzGgK0yq5C6Q6/F3cECPhHapg3f/YtqgzoJDjk7FPUrcwvr0YwMtaPCmsm1Kj+AY
dHtXQHoXwB4OsVx0RwxYr+Sg5QbD2qcj7ZLMR24E9tbK2FahZ3yYr+bFtZYAEsc3
0ccPdh3KVDIpIJuzAYfwzigrHiE4XgZqw9QBzoYryUkHyC6jdK3eH7Mgizh4GE9H
8inPmKKPW7SqfUZxwWzg+lLB8uazAvwEseKnks2kdPiWgO0jt30s0+irZAukAkiL
Zn40ZVZ58k6wMHQzRnjTAaFh7ok8l0EeDz0CAwEAAaAAMA0GCSqGSIb3DQEBCwUA
A4IBAQA2bVqtiwQCER/kgzXCJ3OdK6lJ2SNy+aySy0sxKEsv0iV+pq21FypgV3Dm
/ak7RAwTdxTr91a1zrx1TC5flNNwYf4dO2vZsgM0sf6I2WvWm9mwz7iWEXszsA9j
eHvBpzD6XqaUx8njwYNOqedtUNz57pwE+2GliNPSR3JPsxB2ZxIEsUXYPd0iq4yZ
PyZ2VX4LUSzV01WMKYbn9ED94aahf7d+sbIArDhwoAsGIVgGBgUFwhVgaDGMOhic
mtiEQI3zgJZ/pLrpN7t9g+zQXW2EuFyfKq2l08p6vm0veqobFXxmtkeDPZMUrvlY
MGodzR9AhJdhGgMeVXHsKkTTE0FH
-----END CERTIFICATE REQUEST-----
  `);

  return (
    <Panel raised={true} className="qtr-margin-top">
      <h4>View CSR</h4>
      <Csr csr={csr}></Csr>
    </Panel>
  );
}

export default ViewCsr;
