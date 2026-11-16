import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/student/Profile";
import Jobs from "./pages/student/Jobs";
import Applications from "./pages/student/Applications";
import OfficerDashboard from "./pages/officer/Dashboard";
import Companies from "./pages/officer/Companies";
import OfficerJobs from "./pages/officer/Jobs";
import Students from "./pages/officer/Students";
import StudentDashboard from "./pages/student/Dashboard";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="STUDENT">
              <Profile />
            </ProtectedRoute>
          }
        />
                <Route
          path="/student/jobs"
          element={
            <ProtectedRoute role="STUDENT">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute role="STUDENT">
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer"
          element={
            <ProtectedRoute role="OFFICER">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

                <Route
          path="/officer/companies"
          element={
            <ProtectedRoute role="OFFICER">
              <Companies />
            </ProtectedRoute>
          }
        />

       <Route
          path="/officer/jobs"
          element={
            <ProtectedRoute role="OFFICER">
              <OfficerJobs />
            </ProtectedRoute>
          }
        />

       <Route
          path="/officer/students"
          element={
            <ProtectedRoute role="OFFICER">
              <Students />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}