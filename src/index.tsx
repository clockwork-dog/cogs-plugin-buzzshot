import { createRoot } from "react-dom/client";
import App from "./App";
import { CogsConnectionProvider } from "@clockworkdog/cogs-client-react";

function Root() {
  return (
    <CogsConnectionProvider audioPlayer videoPlayer>
      <App />
    </CogsConnectionProvider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
