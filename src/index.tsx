import { createRoot } from "react-dom/client";
import App from "./App";
import { BuzzshotCogsPluginProvider } from "./BuzzshotCogsPluginProvider";

function Root() {
  return (
    <BuzzshotCogsPluginProvider>
      <App />
    </BuzzshotCogsPluginProvider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
