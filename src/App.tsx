import React from 'react';
import { useCogsConnection, useIsConnected } from '@clockworkdog/cogs-client-react';

import './App.css';

export default function App() {
  const connection = useCogsConnection();
  const isConnected = useIsConnected(connection);  

  return (
  	<div className="App">
  	  <div>Connected: {isConnected.toString()}</div>
  	</div>
  );
}
