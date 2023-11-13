/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// snippet-start:[javascript.v3.scenarios.web.ListObjects]
import { useEffect, useState } from "react";
import {
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./App.css";

function App() {
  const [objects, setObjects] = useState<
    Required<ListObjectsCommandOutput>["Contents"]
  >([]);

  useEffect(() => {
    const client = new S3Client({
      region: "ap-south-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "eu-north-1" },
        identityPoolId: "eu-north-1:6882a53f-ea7c-49cb-b0b6-bea5052ec264",
      }),
    });
    const command = new ListObjectsCommand({ Bucket: "theprintguy-customerfiles" ,ExpectedBucketOwner:"200994887321"});
    client.send(command).then(({ Contents }) => setObjects(Contents || []));
  }, []);

  return (
    <div className="App">
      {objects.map((o) => {
        // Split the date string into an array of strings, using whitespace as the delimiter.
const dateParts = String(o.LastModified).split(/\s+/);

// Get the day, month, and year from the date parts.
const day = dateParts[2];
const month = dateParts[1];
const year = dateParts[3];

        return <div  key={o.ETag}>
        <div>{o.Key}</div>
        <div >{`${day} ${month} ${year}`}</div>
        <div >{o.Size}</div>
        <a 
        target="blank"
        href={
          `https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/${o.Key}`
        } >Download</a>

        </div>
})}
    </div>
  );
}

export default App;
// snippet-end:[javascript.v3.scenarios.web.ListObjects]
