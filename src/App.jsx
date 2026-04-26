import { Suspense, lazy } from "react";

const NevaApp = lazy(() => import("./neva-ui.jsx"));

export default function App() {
  return (
    <Suspense fallback={<div style={{padding: "20px", textAlign: "center"}}>Loading Neva...</div>}>
      <NevaApp />
    </Suspense>
  );
}
