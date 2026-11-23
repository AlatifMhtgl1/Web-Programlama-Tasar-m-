import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import http from "../api/http";

const ORNEK_SINAVLAR = [
  {
    id: 1,
    dersKod: "BLM201",
    dersAd: "Veri Yapıları",
    tarih: "12.01.2027",
    saat: "09:00 - 10:30",
    salon: "Salon A-101",
    siraNo: 14,
  },
];

export default function StudentExamsPage() {
  const [sinavlar, setSinavlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const { data } = await http.get("/exams/my");
        setSinavlar(Array.isArray(data) ? data : []);
      } catch {
        setSinavlar(ORNEK_SINAVLAR);
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-800">Sınav Takvimim</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        {yukleniyor ? (
          <p className="text-sm text-slate-500 py-4">Sınav bilgileri yükleniyor...</p>
        ) : sinavlar.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">
            Henüz yayınlanmış bir sınav oturumunuz bulunmuyor.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-2.5 px-3">Ders</th>
                  <th className="py-2.5 px-3">Tarih</th>
                  <th className="py-2.5 px-3">Saat / Oturum</th>
                  <th className="py-2.5 px-3">Salon</th>
                  <th className="py-2.5 px-3">Sıra No</th>
                </tr>
              </thead>
              <tbody>
                {sinavlar.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {s.dersKod} - {s.dersAd}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{s.tarih}</td>
                    <td className="py-3 px-3 text-slate-700">{s.saat}</td>
                    <td className="py-3 px-3 text-slate-700">{s.salon}</td>
                    <td className="py-3 px-3 font-semibold text-sky-700">{s.siraNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
