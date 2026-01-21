import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HelloWorld from "./assets/HelloWorld";
import HeaderComponent from "./component/HeaderComponent";
import ListReleaseComponent from "./component/ListReleaseComponent";
import FooterComponent from "./component/FooterComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddReleaseComponent from "./component/AddReleaseComponent";
import ReleaseDetailsComponent from "./component/ReleaseDetailsComponent";
import ReportComponent from "./component/ReportComponent";

function App() {
  const [count, setCount] = useState(0);

  // main App component — displays header and HelloWorld child
  return (
    <>
      <Router>
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<ListReleaseComponent />} />
          <Route path="/releases" element={<ListReleaseComponent />} />
          <Route path="/report" element={<ReportComponent />} />
          <Route path="/add-release" element={<AddReleaseComponent />} />
          <Route path="/edit-release/:id" element={<AddReleaseComponent />} />
          <Route
            path="/release-details/:id"
            element={<ReleaseDetailsComponent />}
          />
        </Routes>
        <FooterComponent />
      </Router>
    </>
  );
}

export default App;
