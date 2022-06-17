import React, { useCallback, useState } from "react";
import {
  useCogsConfig,
  useCogsConnection,
  useCogsEvent,
  useIsConnected,
} from "@clockworkdog/cogs-client-react";

import "./App.css";
import {
  BuzzshotGroup,
  setBuzzshotGroupName,
  useBuzzshotPendingGroups,
} from "./buzzshotApi";

interface CogsConnectionParams {
  config: {
    "API Key": string;
  };
  outputEvents: {
    "Group Selected": string;
  };
  inputEvents: {
    "Set Group Name": string;
  };
}

export default function App() {
  const connection = useCogsConnection<CogsConnectionParams>();
  const isConnected = useIsConnected(connection);
  const apiKey = useCogsConfig(connection)?.["API Key"];
  const pendingGroups = useBuzzshotPendingGroups(apiKey);

  const [selectedGroup, setSelectedGroup] = useState<BuzzshotGroup>();

  useCogsEvent(connection, "Set Group Name", async (groupName) => {
    await setBuzzshotGroupName(apiKey, selectedGroup?.id ?? "", groupName);
  });

  return (
    <div className="App">
      <div>Connected: {isConnected.toString()}</div>
      <div>Selected: {selectedGroup?.name || selectedGroup?.id}</div>
      <h2>Pending groups</h2>
      <ul>
        {pendingGroups?.map((group) => (
          <li key={group.id}>
            <GroupButton group={group} onClick={setSelectedGroup} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupButton({
  group,
  onClick,
}: {
  group: BuzzshotGroup;
  onClick?: (group: BuzzshotGroup) => void;
}) {
  const connection = useCogsConnection<CogsConnectionParams>();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      connection.sendEvent("Group Selected", group.name);
      onClick?.(group);
    },
    [connection, group, onClick]
  );

  return (
    <button className="GroupButton" onClick={handleClick}>
      {group.name || group.id}
    </button>
  );
}
