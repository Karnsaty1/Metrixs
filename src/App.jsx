import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import FirstLogin from "./pages/MainLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoutes/index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Artifacts from "./pages/Artifacts.jsx";
import InternalLogin from "./pages/InternalLogin.jsx";
import UnregDash from "./pages/UnregDash.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FirstLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/artifactsDefault/:workspaceId"
            element={<Artifacts />}
          />
          <Route path='/internalDashboard' element={<InternalLogin/>}/>
          <Route path='/undashboard' element={<UnregDash/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
