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
    const command = new ListObjectsCommand({
      Bucket: "theprintguy-customerfiles",
      ExpectedBucketOwner: "200994887321",
    });
    client.send(command).then(({ Contents }) => setObjects(Contents || []));
  }, []);

  return (
    <div className="App">
      <h2>Design Files from Customers</h2>
      <table id="tableContainer">
        <thead>
          <tr>
          <th>Customer Name</th>
          {/* <th>Contact Info</th> */}
            <th>Product Name</th>
            <th>Configuration</th>
            <th>Upload Date</th>
            <th>File Size</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {objects.sort((a, b) => {
            // @ts-ignore
  return new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime();
}).map((o) => {
            // Split the date string into an array of strings, using whitespace as the delimiter.
            const dateParts = String(o.LastModified).split(/\s+/);
            const specs= o.Key?.split("Specs:")[1]?.split(".")[0]?.split(",")
            // console.log("data",specs)

            // Get the day, month, and year from the date parts.
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[3];
            // get customemr info
            const id=o.Key?.split("-")[0] || ""
          // const customer=await getCustomerInfo(id);
            return (
              <tr key={o.ETag}>
                <td style={{fontWeight:"bold"}}>{o.Key?.split("-")[0]}</td>
                {/* <td>{o.Key}</td> */}
                <td style={{fontSize:"small"}}>{o.Key?.split("-")[1]?.split(".")[0]}</td>
                <td>{specs?.map((item,idx)=><li className={"specs"} key={idx}>{item.split("-")[0]} - <span style={{fontWeight:"bold"}}>{item.split("-")[1]}</span></li>)}</td>
                <td>{`${day} ${month} ${year}`}</td>
                <td>{(Number(o.Size)/(1024 * 1024)).toFixed(3)}Mb</td>
                <td>
                  <a
                    target="blank"
                    href={`https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/${o.Key}`}
                  >
                    <button>Download</button>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
