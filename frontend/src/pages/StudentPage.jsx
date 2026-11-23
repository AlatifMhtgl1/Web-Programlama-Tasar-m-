import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calendar, CheckCircle2, Search, BookOpen, XCircle } from "lucide-react";
import http from "../api/http";

const GUNLER = ["Pzt", "Sal", "Car", "Per", "Cum"];

const ORNEK_DERSLER = [
  {
    id: 1,
    kod: "BLM201",
    ad: "Veri Yapıları",
    akademisyen: "Dr. Öğr. Üyesi Ahmet Kaya",
    kontenjan: 40,
    kayitliSayisi: 34,
    kayitliMi: true,
    saatler: [{ gun: "Pzt", baslangic: "09:00", bitis: "11:00", derslik: "D-101" }],
  },
  {
    id: 2,
    kod: "YMH305",
    ad: "Web Programlama",
    akademisyen: "Dr. Öğr. Üyesi Fulya Akdeniz",
    kontenjan: 35,
    kayitliSayisi: 28,
    kayitliMi: false,
    saatler: [{ gun: "Pzt", baslangic: "10:00", bitis: "12:00", derslik: "D-204" }],
  },
  {
    id: 3,
    kod: "MAT204",
    ad: "Olasılık ve İstatistik",
    akademisyen: "Doç. Dr. Mehmet Demir",
    kontenjan: 30,
    kayitliSayisi: 30,
    kayitliMi: false,
    saatler: [{ gun: "Sal", baslangic: "13:00", bitis: "15:00", derslik: "B-102" }],
  },
  {
    id: 4,
    kod: "YMH302",
    ad: "Veritabanı Yönetim Sistemleri",
    akademisyen: "Dr. Öğr. Üyesi Zeynep Arslan",
    kontenjan: 45,
    kayitliSayisi: 20,
    kayitliMi: false,
    saatler: [{ gun: "Car", baslangic: "09:00", bitis: "11:00", derslik: "D-105" }],
  },
];

function saatDakikaya(saatStr) {
  const [saat, dk] = saatStr.split(":").map(Number);
  return saat * 60 + dk;
}

function blokCakisiyorMu(a, b) {
  if (a.gun !== b.gun) return false;
  return saatDakikaya(a.baslangic) < saatDakikaya(b.bitis) && saatDakikaya(b.baslangic) < saatDakikaya(a.bitis);
}

export default function StudentPage() {
  const [dersler, setDersler] = useState([]);
  const [arama, setArama] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemId, setIslemId] = useState(null);
  const [mesaj, setMesaj] = useState(null); // { tip: "ok" | "hata", metin: string }
  const [kayitAcikMi, setKayitAcikMi] = useState(true);
  const [donemBilgisi, setDonemBilgisi] = useState("2026-2027 Güz Dönemi (Kayıt Açık)");

  const dersleriYukle = async () => {
    setYukleniyor(true);
    try {
      const { data } = await http.get("/courses");
      if (Array.isArray(data)) {
        setDersler(data);
      } else if (data?.courses) {
        setDersler(data.courses);
        if (typeof data.enrollmentOpen === "boolean") setKayitAcikMi(data.enrollmentOpen);
        if (data.termInfo) setDonemBilgisi(data.termInfo);
      }
    } catch {
      // Backend henüz bağlı değilse sade örnek veri ile devam et
      setDersler(ORNEK_DERSLER);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    dersleriYukle();
  }, []);

  const kayitliDersler = useMemo(() => dersler.filter((d) => d.kayitliMi), [dersler]);

  // Seçilen derslerle saat çakışması yapan dersleri önceden tespit et (FR-4.4, FR-4.9, BR-01)
  const cakismaHaritasi = useMemo(() => {
    const map = {};
    for (const ders of dersler) {
      if (ders.kayitliMi) continue;
      for (const kDers of kayitliDersler) {
        let cakisiyor = false;
        let cakisilanSaat = "";
        for (const s1 of ders.saatler || []) {
          for (const s2 of kDers.saatler || []) {
            if (blokCakisiyorMu(s1, s2)) {
              cakisiyor = true;
              cakisilanSaat = `${s2.gun} ${s2.baslangic}-${s2.bitis}`;
              break;
            }
          }
          if (cakisiyor) break;
        }
        if (cakisiyor) {
          map[ders.id] = `${kDers.kod} (${kDers.ad}) ile ${cakisilanSaat} çakışıyor`;
          break;
        }
      }
    }
    return map;
  }, [dersler, kayitliDersler]);

  const filtrelenmisDersler = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return dersler;
    return dersler.filter(
      (d) =>
        d.kod.toLowerCase().includes(q) ||
        d.ad.toLowerCase().includes(q) ||
        d.akademisyen.toLowerCase().includes(q)
    );
  }, [dersler, arama]);

  const handleKayitDegistir = async (ders) => {
    setMesaj(null);

    if (!kayitAcikMi) {
      setMesaj({
        tip: "hata",
        metin: `Ders seçim penceresi şu an kapalı (${donemBilgisi}). Açık tarih aralığında tekrar deneyin.`,
      });
      return;
    }

    if (!ders.kayitliMi) {
      if (cakismaHaritasi[ders.id]) {
        setMesaj({
          tip: "hata",
          metin: `Kayıt engellendi: ${cakismaHaritasi[ders.id]}. Lütfen çakışmayan bir ders seçin.`,
        });
        return;
      }
      if (ders.kayitliSayisi >= ders.kontenjan) {
        setMesaj({
          tip: "hata",
          metin: `Kayıt engellendi: '${ders.kod}' dersinin kontenjanı dolu (${ders.kontenjan}/${ders.kontenjan}).`,
        });
        return;
      }
    }

    setIslemId(ders.id);
    try {
      if (ders.kayitliMi) {
        await http.delete(`/enrollments/${ders.id}`);
        setMesaj({ tip: "ok", metin: `'${ders.kod} - ${ders.ad}' dersi bırakıldı.` });
      } else {
        await http.post("/enrollments", { courseId: ders.id });
        setMesaj({ tip: "ok", metin: `'${ders.kod} - ${ders.ad}' dersine kayıt olundu.` });
      }
      await dersleriYukle();
    } catch (err) {
      // Backend bağlı değilken yerel durumu güncelle
      if (!err.response) {
        setDersler((prev) =>
          prev.map((item) => {
            if (item.id !== ders.id) return item;
            if (item.kayitliMi) {
              return { ...item, kayitliMi: false, kayitliSayisi: Math.max(0, item.kayitliSayisi - 1) };
            }
            return { ...item, kayitliMi: true, kayitliSayisi: item.kayitliSayisi + 1 };
          })
        );
        setMesaj({
          tip: "ok",
          metin: ders.kayitliMi
            ? `'${ders.kod}' dersi bırakıldı (yerel önizleme).`
            : `'${ders.kod}' dersine kayıt olundu (yerel önizleme).`,
        });
      } else {
        setMesaj({
          tip: "hata",
          metin: err.response?.data?.message || "İşlem sırasında bir hata oluştu.",
        });
      }
    } finally {
      setIslemId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Öğrenci Ders Seçimi ve Program</h1>
          <p className="text-sm text-slate-500">{donemBilgisi}</p>
        </div>
        <div className="text-sm bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-lg font-medium">
          Kayıtlı Ders: {kayitliDersler.length}
        </div>
      </div>

      {mesaj && (
        <div
          className={`p-3.5 rounded-lg border text-sm flex items-start gap-2 ${
            mesaj.tip === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {mesaj.tip === "ok" ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{mesaj.metin}</span>
        </div>
      )}

      {/* Ders Arama ve Filtreleme (FR-4.2) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ders kodu, ders adı veya akademisyen adına göre ara..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        {yukleniyor ? (
          <p className="text-sm text-slate-500 py-6 text-center">Dersler yükleniyor...</p>
        ) : filtrelenmisDersler.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">Aramanızla eşleşen ders bulunamadı.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                  <th className="py-2.5 px-3">Kod / Ders Adı</th>
                  <th className="py-2.5 px-3">Akademisyen</th>
                  <th className="py-2.5 px-3">Gün - Saat</th>
                  <th className="py-2.5 px-3">Kontenjan / Doluluk</th>
                  <th className="py-2.5 px-3">Durum</th>
                  <th className="py-2.5 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtrelenmisDersler.map((ders) => {
                  const doluMu = !ders.kayitliMi && ders.kayitliSayisi >= ders.kontenjan;
                  const cakismaVarMi = !ders.kayitliMi && Boolean(cakismaHaritasi[ders.id]);
                  const engelliMi = doluMu || cakismaVarMi || !kayitAcikMi;

                  return (
                    <tr key={ders.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{ders.kod}</div>
                        <div className="text-slate-600">{ders.ad}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{ders.akademisyen}</td>
                      <td className="py-3 px-3 text-slate-700">
                        {(ders.saatler || []).map((s, idx) => (
                          <div key={idx}>
                            {s.gun} {s.baslangic}-{s.bitis} ({s.derslik})
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {ders.kayitliSayisi} / {ders.kontenjan}
                      </td>
                      <td className="py-3 px-3">
                        {ders.kayitliMi ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Kayıtlı
                          </span>
                        ) : cakismaVarMi ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-100 text-amber-900 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" /> {cakismaHaritasi[ders.id]}
                          </span>
                        ) : doluMu ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-rose-100 text-rose-800 font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Kontenjan Dolu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-100 text-slate-700">
                            <BookOpen className="w-3.5 h-3.5" /> Seçilebilir
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          disabled={islemId === ders.id || (!ders.kayitliMi && engelliMi)}
                          onClick={() => handleKayitDegistir(ders)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            ders.kayitliMi
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : "bg-sky-600 hover:bg-sky-700 text-white"
                          }`}
                        >
                          {islemId === ders.id
                            ? "İşleniyor..."
                            : ders.kayitliMi
                            ? "Dersi Bırak"
                            : "Kayıt Ol"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Haftalık Ders Programı Görünümü (FR-4.7) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-800">Haftalık Ders Programım</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {GUNLER.map((gun) => {
            const gunBloklari = [];
            for (const d of kayitliDersler) {
              for (const s of d.saatler || []) {
                if (s.gun === gun) {
                  gunBloklari.push({ kod: d.kod, ad: d.ad, ...s });
                }
              }
            }
            gunBloklari.sort((a, b) => a.baslangic.localeCompare(b.baslangic));

            return (
              <div key={gun} className="border border-slate-200 rounded-lg p-3 bg-slate-50/60">
                <div className="font-semibold text-slate-800 text-sm mb-2 pb-1 border-b border-slate-200">
                  {gun}
                </div>
                {gunBloklari.length === 0 ? (
                  <p className="text-xs text-slate-400">Ders yok</p>
                ) : (
                  <div className="space-y-2">
                    {gunBloklari.map((b, idx) => (
                      <div key={idx} className="bg-white border border-sky-200 rounded p-2 text-xs">
                        <div className="font-bold text-sky-900">
                          {b.baslangic} - {b.bitis}
                        </div>
                        <div className="font-semibold text-slate-800">
                          {b.kod} - {b.ad}
                        </div>
                        <div className="text-slate-500">Derslik: {b.derslik}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
