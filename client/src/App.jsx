import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadList from "./pages/LeadList";
import LeadDetail from "./pages/LeadDetail";
import LeadForm from "./pages/LeadForm";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="bottom-right" />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <LeadList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads/add" 
            element={
              <ProtectedRoute>
                <LeadForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads/edit/:leadId" 
            element={
              <ProtectedRoute>
                <LeadForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads/:leadId" 
            element={
              <ProtectedRoute>
                <LeadDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;