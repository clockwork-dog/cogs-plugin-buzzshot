import base64 from "base-64";
import { useEffect, useState } from "react";

const ENDPOINT = "https://buzzshot.co";

export interface BuzzshotGroup {
  id: string;
  name: string;
  date: string;
  time: string;
}

export async function getBuzzshotPendingGroups(
  apiKey: string
): Promise<BuzzshotGroup[]> {
  return (
    await (
      await fetch(
        ENDPOINT +
          "/integrations/cogs/teams/?status=pending&key=" +
          encodeURIComponent(apiKey),
        {
          // headers: authHeaders(apiKey),
        }
      )
    ).json()
  ).objects;
}

export async function setBuzzshotGroupName(
  apiKey: string,
  id: string,
  name: string
): Promise<BuzzshotGroup[]> {
  return (
    await (
      await fetch(
        ENDPOINT +
          "/integrations/cogs/teams/?key=" +
          encodeURIComponent(apiKey),
        {
          method: "POST",
          // headers: authHeaders(apiKey),
          body: JSON.stringify({
            id,
            name,
          }),
        }
      )
    ).json()
  ).objects;
}

function authHeaders(apiKey: string) {
  return {
    Authorization: `Basic ${base64.encode(apiKey + ":x")}`,
  };
}

export function useBuzzshotPendingGroups(apiKey: string | undefined) {
  const [pendingGroups, setPendingGroups] = useState<BuzzshotGroup[]>();

  useEffect(() => {
    if (apiKey) {
      (async () => {
        setPendingGroups(await getBuzzshotPendingGroups(apiKey));
      })();
    }
  }, [apiKey]);

  return pendingGroups;
}
