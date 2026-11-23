import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import http from "../api/http";

function sifreGecerliMi(sifre) {
  return sifre.length >= 8 && /[A-Za-z]/.test(sifre) && /[0-9]/.test(sifre);
}

export default function LoginPage({ onLogin }) {
  const [mod, setMod] = useState("login"); // "login" | "register"
  const [adSoyad, setAdSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const navigate = useNavigate();

  const roleGoreYonlendir = (rol) => {
    if (rol === "Admin") navigate("/admin");
    else if (rol === "Akademisyen") navigate("/lecturer");
    else navigate("/student");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata("");
    setBilgi("");

    if (!email.trim() || !password) {
      setHata("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    if (mod === "register") {
      if (!adSoyad.trim()) {
        setHata("Kayıt olmak için ad soyad girmeniz gerekir.");
        return;
      }
      if (!sifreGecerliMi(password)) {
        setHata("Şifre en az 8 karakter olmalı ve en az bir harf ile bir rakam içermelidir.");
        return;
      }
    }

    setYukleniyor(true);
    try {
      if (mod === "register") {
        await http.post("/auth/register", {
          adSoyad: adSoyad.trim(),
          email: email.trim(),
          password,
        });
        setBilgi("Kayıt başarılı! Öğrenci hesabınız oluşturuldu, şimdi giriş yapabilirsiniz.");
        setMod("login");
      } else {
        const { data } = await http.post("/auth/login", {
          email: email.trim(),
          password,
        });
        localStorage.setItem("token", data.token);
        const apiUser = data.user;
        const userObj = {
          id: apiUser.id,
          adSoyad: apiUser.adSoyad,
          email: apiUser.email,
          rol: apiUser.rol,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        onLogin(userObj);
        roleGoreYonlendir(userObj.rol);
      }
    } catch (err) {
      const apiMesaj =
        err.response?.data?.message ||
        "Sunucuya bağlanılamadı veya bilgiler hatalı. Bilgilerinizi kontrol edip tekrar deneyin.";
      setHata(apiMesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  const hizliDemoGiris = (rol) => {
    const demoUser = {
      id: rol === "Admin" ? 1 : rol === "Akademisyen" ? 2 : 3,
      adSoyad: rol === "Admin" ? "Demo Admin" : rol === "Akademisyen" ? "Dr. Demo Hoca" : "Demo Öğrenci",
      email: "demo@kostu.edu.tr",
      rol,
    };
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoUser));
    onLogin(demoUser);
    roleGoreYonlendir(rol);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMod("login");
              setHata("");
              setBilgi("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md cursor-pointer ${
              mod === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMod("register");
              setHata("");
              setBilgi("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md cursor-pointer ${
              mod === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Kayıt Ol (Öğrenci)
          </button>
        </div>

        <h1 className="text-xl font-bold text-slate-800 mb-1">
          {mod === "login" ? "Hesabınıza Giriş Yapın" : "Yeni Öğrenci Kaydı"}
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          {mod === "login"
            ? "E-posta ve şifrenizle sisteme giriş yapın."
            : "Kayıt olan kullanıcılar otomatik olarak Öğrenci rolüyle açılır."}
        </p>

        {hata && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{hata}</span>
          </div>
        )}

        {bilgi && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{bilgi}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mod === "register" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                placeholder="Örn: Ali Yılmaz"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@ogrenci.kostu.edu.tr"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 8 karakter, harf ve rakam"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            {mod === "register" && (
              <p className="text-xs text-slate-500 mt-1">
                Kural: En az 8 karakter, en az 1 harf ve 1 rakam içermelidir.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            {yukleniyor
              ? "İşlem yapılıyor..."
              : mod === "login"
              ? "Giriş Yap"
              : "Öğrenci Olarak Kayıt Ol"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">
            Arayüz önizleme (API bağlı değilken ekranları test etmek için):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => hizliDemoGiris("Ogrenci")}
              className="text-xs py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Öğrenci
            </button>
            <button
              type="button"
              onClick={() => hizliDemoGiris("Akademisyen")}
              className="text-xs py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Akademisyen
            </button>
            <button
              type="button"
              onClick={() => hizliDemoGiris("Admin")}
              className="text-xs py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
