import https, { RequestOptions } from "https";
import { HttpMethod } from "../enums";
import { FetchoParams } from "../types";

const fetcho = ({
  url,
  method = HttpMethod.GET,
  body,
  token,
  headers = {},
}: FetchoParams): Promise<Record<string, any> | false> => {
  const urlObj = new URL(url);

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const requestOptions: RequestOptions = {
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https
      .request(requestOptions, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (data === "") {
            reject(new Error("Empty response from server"));
            return;
          }

          try {
            const parsedData = JSON.parse(data);

            if (!res.statusCode) return;

            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(
                new Error(`Server error with status code ${res.statusCode}`)
              );
              return;
            }

            resolve(parsedData);
          } catch (error) {
            reject(new Error(`Error parsing response: ${error}`));
          }
        });
      })
      .on("error", (error) => {
        console.log(url);
        reject(error);
      });

    if (
      body &&
      (method === HttpMethod.POST ||
        method === HttpMethod.PUT ||
        method === HttpMethod.PATCH)
    ) {
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }

    req.end();
  });
};

export default fetcho;
