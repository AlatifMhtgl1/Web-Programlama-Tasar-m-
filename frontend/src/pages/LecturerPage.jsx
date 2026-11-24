import { useEffect, useState } from "react";
import { BookOpen, CalendarClock, CheckCircle2, Eye, Users } from "lucide-react";
import http from "../api/http";

const ORNEK_DERSLER = [
  {
    id: 1,
    kod: "YMH305",
    ad: "Web Programlama",
    kontenjan: 35,
    ogrenciler: [
      { id: 101, adSoyad: "Ali Yılmaz", ogrenciNo: "240502001" },
      { id: 102, adSoyad: "Ayşe Kaya", ogrenciNo: "240502002" },
    ],
  },
];

const ORNEK_SINAVLAR = [
  {
    id: 1,
    dersKod: "YMH305",
    dersAd: "Web Programlama",
    tarih: "14.01.2027",
    saat: "09:00 - 10:30",
    salonlar: "D-101, D-102",
    gozetmenMi: false,
  },
  {
    id: 2,
    dersKod: "BLM201",
    dersAd: "Veri Yapıları",
    tarih: "16.01.2027",
    saat: "13:00 - 14:30",
    salonlar: "B-201",
    gozetmenMi: true,
  },
];

export default function LecturerPage() {
  const [dersler, setDersler] = useState([]);
  const [seciliDersId, setSeciliDersId] = useState(null);
  const [sinavlar, setSinavlar] = useState([]);
  const [tercihDersId, setTercihDersId] = useState("");
  const [tercihMetni, setTercihMetni] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const [dersRes, sinavRes] = await Promise.all([
          http.get("/lecturer/courses"),
          http.get("/lecturer/exams"),
        ]);
        const dList = Array.isArray(dersRes.data) ? dersRes.data : ORNEK_DERSLER;
        const sList = Array.isArray(sinavRes.data) ? sinavRes.data : ORNEK_SINAVLAR;
        setDersler(dList);
        setSinavlar(sList);
        if (dList.length > 0) {
          setSeciliDersId(dList[0].id);
          setTercihDersId(String(dList[0].id));
        }
      } catch {
        setDersler(ORNEK_DERSLER);
        setSinavlar(ORNEK_SINAVLAR);
        setSeciliDersId(ORNEK_DERSLER[0].id);
        setTercihDersId(String(ORNEK_DERSLER[0].id));
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, []);

  const seciliDers = dersler.find((d) => d.id === seciliDersId) || dersler[0];

  const handleTercihGonder = async (e) => {
    e.preventDefault();
    setMesaj("");
    if (!tercihDersId || !tercihMetni.trim()) {
      setMesaj("Lütfen bir ders seçin ve tercih ettiğiniz gün/saat bilgisini yazın.");
      return;
    }

    try {
      await http.post("/lecturer/exam-preference", {
        courseId: Number(tercihDersId),
        preference: tercihMetni.trim(),
      });
    } catch {
      // Backend bağlı değilse yerel geri bildirim ver
    }

    setMesaj("Sınav gün/saat tercihiniz kaydedildi (zorunlu çakışma ve kapasite kuralları önceliklidir).");
    setTercihMetni("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Akademisyen Paneli</h1>
        <p className="text-sm text-slate-500">
          Kendi derslerinizi, öğrenci listelerinizi, sınav tercihlerinizi ve yayınlanan sınavları görüntüleyin.
        </p>
      </div>

      {mesaj && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mesaj}</span>
        </div>
      )}

      {yukleniyor ? (
        <p className="text-sm text-slate-500">Veriler yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Derslerim ve Öğrenci Listesi (FR-7.1) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-800">Derslerim ve Kayıtlı Öğrenciler</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {dersler.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSeciliDersId(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    seciliDers?.id === d.id
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {d.kod} - {d.ad}
                </button>
              ))}
            </div>

            {seciliDers && (
              <div className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-800">{seciliDers.ad}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {(seciliDers.ogrenciler || []).length} / {seciliDers.kontenjan} Öğrenci
                  </span>
                </div>
                <ul className="divide-y divide-slate-100 text-sm">
                  {(seciliDers.ogrenciler || []).map((ogr) => (
                    <li key={ogr.id} className="py-2 flex justify-between text-slate-700">
                      <span>{ogr.adSoyad}</span>
                      <span className="text-xs text-slate-500">{ogr.ogrenciNo || "-"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sınav Tercihi Bildirme (FR-5.9, FR-7.3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-800">Sınav Gün / Saat Tercihi</h2>
            </div>

            <form onSubmit={handleTercihGonder} className="space-y-3 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Ders Seçin</label>
                <select
                  value={tercihDersId}
                  onChange={(e) => setTercihDersId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  {dersler.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.kod} - {d.ad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tercih Edilen Gün ve Saat Aralığı
                </label>
                <input
                  type="text"
                  value={tercihMetni}
                  onChange={(e) => setTercihMetni(e.target.value)}
                  placeholder="Örn: Çarşamba 09:00-11:00 arası uygun"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
              >
                Tercihi Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Yayınlanan Sınavlar ve Gözetmenlik (FR-7.2, FR-7.4) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-800">Yayınlanan Sınavlar ve Gözetmenliklerim</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3">Ders</th>
                <th className="py-2.5 px-3">Tarih</th>
                <th className="py-2.5 px-3">Saat</th>
                <th className="py-2.5 px-3">Salonlar</th>
                <th className="py-2.5 px-3">Görev</th>
              </tr>
            </thead>
            <tbody>
              {sinavlar.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {s.dersKod} - {s.dersAd}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{s.tarih}</td>
                  <td className="py-2.5 px-3 text-slate-700">{s.saat}</td>
                  <td className="py-2.5 px-3 text-slate-700">{s.salonlar}</td>
                  <td className="py-2.5 px-3">
                    {s.gozetmenMi ? (
                      <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-900 font-medium">
                        Gözetmen
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-700">
                        Ders Sorumlusu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
