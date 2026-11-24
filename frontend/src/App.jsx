import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";
import StudentExamsPage from "./pages/StudentExamsPage";
import LecturerPage from "./pages/LecturerPage";
import AssistantPage from "./pages/AssistantPage";
import AdminPage from "./pages/AdminPage";

function KorunmusSayfa({ user, izinliRoller, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (izinliRoller && !izinliRoller.includes(user.rol)) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
        Bu sayfaya erişim yetkiniz bulunmamaktadır (403).
      </div>
    );
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const kayitli = localStorage.getItem("user");
    if (!kayitli) return null;

    try {
      return JSON.parse(kayitli);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />

        <Route
          path="/student"
          element={
            <KorunmusSayfa user={user} izinliRoller={["Ogrenci"]}>
              <StudentPage />
            </KorunmusSayfa>
          }
        />
        <Route
          path="/student/exams"
          element={
            <KorunmusSayfa user={user} izinliRoller={["Ogrenci"]}>
              <StudentExamsPage />
            </KorunmusSayfa>
          }
        />
        <Route
          path="/lecturer"
          element={
            <KorunmusSayfa user={user} izinliRoller={["Akademisyen"]}>
              <LecturerPage />
            </KorunmusSayfa>
          }
        />
        <Route
          path="/admin"
          element={
            <KorunmusSayfa user={user} izinliRoller={["Admin"]}>
              <AdminPage />
            </KorunmusSayfa>
          }
        />
        <Route
          path="/assistant"
          element={
            <KorunmusSayfa user={user} izinliRoller={["Ogrenci", "Akademisyen", "Admin"]}>
              <AssistantPage />
            </KorunmusSayfa>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
