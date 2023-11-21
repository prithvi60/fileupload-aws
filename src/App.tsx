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
    const command = new ListObjectsCommand({
      Bucket: "theprintguy-customerfiles",
      ExpectedBucketOwner: "200994887321",
    });
    client.send(command).then(({ Contents }) => setObjects(Contents || []));
  }, []);
  // const getCustomerInfo= async (id: string) => {
  //   // console.log("test price deets",id)
  //   const username ="fd829fb1b82ee954210c08ffa03c3746";
  //   const password="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";
  //   const response = await fetch(`https://2f8923-2.myshopify.com/admin/api/2023-10/customers/${id}.json`, {
  //     method: "GET",
  //     headers: {
  //       "Authorization": `Basic ${btoa(username + ":" + password)}`,
  //       "Cache-Control": "no-cache, no-store, must-revalidate"
  //       },
  //   });
  
  //   if (response.status === 200) {
  //     return response.json()
  //   } 
  // };

//   const [comments,setComments]=useState([])
//   let urls = objects.sort((a, b) => {
//     // @ts-ignore
// return new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime();
// }).map((o) => `https://2f8923-2.myshopify.com/admin/api/2023-10/customers/7399818199359.json`);

// useEffect(() => {
//   fetchComments();
// }, [])

// const fetchComments = async () => {
//   let fetchedComments:any = [];
//   Promise.all(
//     urls.map(async (url) => {
//       const username ="fd829fb1b82ee954210c08ffa03c3746";
//       const password="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";
//       let response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Authorization": `Basic ${btoa(username + ":" + password)}`,
//           "Cache-Control": "no-cache, no-store, must-revalidate"
//           },
//       })
//       let data = await response.json();
//       fetchedComments.push(data);
//       console.log(fetchedComments)
//     })
//   )
//   setComments(fetchedComments);
// }

// const fetchComments = async () => {
//   const username ="fd829fb1b82ee954210c08ffa03c3746";
//   const password="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";
//   const response = await Promise.all(
//     urls.map((url) =>  fetch(url, {
//       method: "GET",
//       mode:"no-cors",
//       headers: {
//         "Authorization": `Basic ${btoa(username + ":" + password)}`,
//         "Cache-Control": "no-cache, no-store, must-revalidate"
//         },
//     }).then(res => res.json()))
//   )
//   const fetchedComments = [].concat.apply([], response);
//   setComments(fetchedComments);
// }
// console.log("customer data",comments)
  return (
    <div className="App">
      <h2>Design Files from Customers</h2>
      <table>
        <thead>
          <tr>
          <th>Customer Name</th>
          {/* <th>Contact Info</th> */}
            <th>Product Name</th>
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
            // console.log("data",o.LastModified)

            // Get the day, month, and year from the date parts.
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[3];
            // get customemr info
            const id=o.Key?.split("-")[0] || ""
          // const customer=await getCustomerInfo(id);
            return (
              <tr key={o.ETag}>
                <td>{o.Key?.split("-")[0]}</td>
                {/* <td>{o.Key}</td> */}
                <td>{o.Key?.split("-")[1]?.split(".")[0]}</td>

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
