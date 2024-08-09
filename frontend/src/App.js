import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AddCompany from "./pages/AddCompany";
import Dashboard from "./pages/Dashboard";
import UserCreation from "./pages/UserCreation";
import Login from "./pages/Login";
import ListOfActions from "./pages/ListOfActions";
import AlertManagement from "./pages/AlertManagement";
import ControlFamiliesPage from "./pages/ControlFamiliesPage";
import ControlsPage from "./pages/ControlsPage";
import ActionsPage from "./pages/ActionsPage";
import UploadPage from "./pages/UploadPage";
import AssetList from "./pages/asset/AssetsList";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  const [selectedItem, setSelectedItem] = useState("Asset");

  const handleSidebarClick = (title) => {
    setSelectedItem(title);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {authToken && <Sidebar onSelect={handleSidebarClick} />}
        <div className="main-content flex flex-col flex-grow">
          {authToken && (
            <Header title={selectedItem} handleLogout={handleLogout} />
          )}
          <div className="flex h-screen">
            <div className="flex flex-col flex-grow">
              <main className="flex-grow p-4">
                <Routes>
                  <Route
                    path="/login"
                    element={<Login setAuthToken={setAuthToken} />}
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-company"
                    element={
                      <PrivateRoute>
                        <AddCompany />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/user-creation"
                    element={
                      <PrivateRoute>
                        <UserCreation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/asset-management"
                    element={
                      <PrivateRoute>
                        <AssetList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/list-of-actions"
                    element={
                      <PrivateRoute>
                        <ListOfActions />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/alert-management"
                    element={
                      <PrivateRoute>
                        <AlertManagement />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/control-families"
                    element={
                      <PrivateRoute>
                        <ControlFamiliesPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/controls"
                    element={
                      <PrivateRoute>
                        <ControlsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/actions"
                    element={
                      <PrivateRoute>
                        <ActionsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <PrivateRoute>
                        <UploadPage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/" element={<Home />} />
                  <Route path="/add-company" element={<AddCompany />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;