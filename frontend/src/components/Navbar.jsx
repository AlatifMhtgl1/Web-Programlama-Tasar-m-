import { Link, useNavigate } from "react-router-dom";
import { LogOut, GraduationCap } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 text-white px-4 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-sm sm:text-base">
          <GraduationCap className="w-5 h-5 text-sky-400" />
          <span>Akıllı Ders ve Sınav Sistemi</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-slate-800 text-sky-300">
            {user.rol}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {user.rol === "Ogrenci" && (
            <>
              <Link to="/student" className="hover:text-sky-300">
                Ders Seçimi ve Program
              </Link>
              <Link to="/student/exams" className="hover:text-sky-300">
                Sınav Takvimim
              </Link>
            </>
          )}

          {user.rol === "Akademisyen" && (
            <Link to="/lecturer" className="hover:text-sky-300">
              Akademisyen Paneli
            </Link>
          )}

          {user.rol === "Admin" && (
            <Link to="/admin" className="hover:text-sky-300">
              Admin Paneli
            </Link>
          )}

          <Link to="/assistant" className="hover:text-sky-300">
            Asistan
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded text-xs sm:text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
