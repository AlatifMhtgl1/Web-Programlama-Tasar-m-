import { useState } from "react";
import { Bot, Send } from "lucide-react";
import http from "../api/http";

function yedekYanitUret(soru) {
  const k = soru.toLowerCase();
  if (k.includes("sınav") || k.includes("salon") || k.includes("sıra")) {
    return "Yayınlanmış sınav planınızdaki tarih, salon ve sıra bilgilerinizi yetkiniz dahilinde görüntüleyebilirsiniz.";
  }
  if (k.includes("ders") || k.includes("kontenjan") || k.includes("çakış")) {
    return "Ders kayıtlarında saat çakışması ve kontenjan kuralları uygulanır; yalnızca açık seçim döneminde kayıt açılır.";
  }
  return "Şu an backend/LLM servisine erişilemiyor (SSS yedeği devrede). Bu bilgiye ulaşılamadı veya ilgili menüden kontrol edebilirsiniz.";
}

export default function AssistantPage() {
  const [soru, setSoru] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesajlar, setMesajlar] = useState([
    {
      kim: "bot",
      metin: "Merhaba! Ders programınız, kontenjanlar, kayıt kuralları veya yayınlanmış sınavlarınız hakkında soru sorabilirsiniz.",
    },
  ]);

  const handleGonder = async (e) => {
    e.preventDefault();
    if (!soru.trim() || yukleniyor) return;

    const metin = soru.trim();
    setSoru("");
    setMesajlar((prev) => [...prev, { kim: "ben", metin }]);
    setYukleniyor(true);

    try {
      const { data } = await http.post("/chatbot/ask", { soru: metin });
      setMesajlar((prev) => [
        ...prev,
        { kim: "bot", metin: data.yanit || data.answer || "Bu bilgiye ulaşılamadı." },
      ]);
    } catch {
      setMesajlar((prev) => [...prev, { kim: "bot", metin: yedekYanitUret(metin) }]);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-800">Akıllı Asistan</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-[460px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 text-sm">
          {mesajlar.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[85%] ${
                m.kim === "ben"
                  ? "bg-sky-600 text-white ml-auto"
                  : "bg-slate-100 text-slate-800 mr-auto"
              }`}
            >
              {m.metin}
            </div>
          ))}
          {yukleniyor && <p className="text-xs text-slate-500">Yanıt hazırlanıyor...</p>}
        </div>

        <form onSubmit={handleGonder} className="flex gap-2">
          <input
            type="text"
            value={soru}
            onChange={(e) => setSoru(e.target.value)}
            placeholder="Örn: Sınavım ne zaman? Hangi derslerim var?"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={yukleniyor}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Gönder</span>
          </button>
        </form>
      </div>
    </div>
  );
}
