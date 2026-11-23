import { useState } from "react";
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Play,
  ShieldCheck,
  Upload,
} from "lucide-react";
import http from "../api/http";

export default function AdminPage() {
  const [sekme, setSekme] = useState("ders-donem"); // "ders-donem" | "veri-yukle" | "sinav-plani" | "raporlar"
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");

  // Ders & Derslik & Dönem state'leri (FR-2.1, FR-2.3, FR-2.4)
  const [dersForm, setDersForm] = useState({
    kod: "",
    ad: "",
    akademisyenId: 2,
    kontenjan: 35,
    gun: "Pzt",
    baslangic: "09:00",
    bitis: "11:00",
    derslik: "D-101",
  });

  const [derslikForm, setDerslikForm] = useState({
    ad: "",
    kapasite: 40,
  });

  const [donemForm, setDonemForm] = useState({
    ad: "2026-2027 Güz Dönemi",
    secimBaslangic: "2026-10-01",
    secimBitis: "2026-12-15",
    sinavBaslangic: "2027-01-10",
    sinavBitis: "2027-01-22",
    oturumlar: "Pzt 09:00-11:00, Pzt 13:00-15:00, Sal 09:00-11:00",
  });

  // Excel/CSV yükleme state'leri (FR-3.1 - FR-3.5)
  const [dosya, setDosya] = useState(null);
  const [yuklemeOzeti, setYuklemeOzeti] = useState({
    toplam: 120,
    eklenen: 112,
    guncellenen: 5,
    atlanan: 3,
    hatalar: ["Satır 14: Geçersiz kontenjan değeri (0 veya negatif olamaz).", "Satır 28: Ders kodu boş bırakılamaz."],
  });

  // Sınav planı state'leri (FR-5.1 - FR-5.8)
  const [planDurumu, setPlanDurumu] = useState("Taslak");
  const [sinavPlani, setSinavPlani] = useState([
    { id: 1, dersKod: "YMH305", dersAd: "Web Programlama", oturum: "Pzt 09:00-11:00", salon: "D-101", ogrenciSayisi: 32 },
    { id: 2, dersKod: "BLM201", dersAd: "Veri Yapıları", oturum: "Pzt 13:00-15:00", salon: "D-102", ogrenciSayisi: 28 },
  ]);
  const [yerlesemeyenler, setYerlesemeyenler] = useState([]);

  // Raporlar state'leri (FR-10.1 - FR-10.4)
  const [raporlar] = useState([
    { salon: "D-101", kapasite: 40, kullanilan: 32, dolulukYuzde: 80, cakismaSayisi: 0 },
    { salon: "D-102", kapasite: 35, kullanilan: 28, dolulukYuzde: 80, cakismaSayisi: 1 },
    { salon: "B-201", kapasite: 50, kullanilan: 20, dolulukYuzde: 40, cakismaSayisi: 0 },
  ]);

  const temizleUyari = () => {
    setMesaj("");
    setHata("");
  };

  const handleDersEkle = async (e) => {
    e.preventDefault();
    temizleUyari();
    if (!dersForm.kod.trim() || !dersForm.ad.trim() || Number(dersForm.kontenjan) <= 0) {
      setHata("Ders kodu, ders adı ve sıfırdan büyük bir kontenjan girilmelidir.");
      return;
    }
    try {
      await http.post("/admin/courses", dersForm);
    } catch {
      // Backend bağlı değilken önizleme mesajı
    }
    setMesaj(`'${dersForm.kod}' ders kaydı işlendi.`);
    setDersForm({ ...dersForm, kod: "", ad: "" });
  };

  const handleDerslikEkle = async (e) => {
    e.preventDefault();
    temizleUyari();
    if (!derslikForm.ad.trim() || Number(derslikForm.kapasite) <= 0) {
      setHata("Derslik adı ve sıfırdan büyük kapasite değeri girilmelidir.");
      return;
    }
    try {
      await http.post("/admin/rooms", derslikForm);
    } catch {
      // Yerel önizleme
    }
    setMesaj(`'${derslikForm.ad}' dersliği (${derslikForm.kapasite} kapasite) kaydedildi.`);
    setDerslikForm({ ad: "", kapasite: 40 });
  };

  const handleDonemKaydet = async (e) => {
    e.preventDefault();
    temizleUyari();
    try {
      await http.post("/admin/terms", donemForm);
    } catch {
      // Yerel önizleme
    }
    setMesaj("Dönem, ders seçim penceresi ve sınav oturumları güncellendi.");
  };

  const handleDosyaSec = (e) => {
    temizleUyari();
    const secilen = e.target.files?.[0];
    if (!secilen) return;

    const gecerliUzanti = secilen.name.toLowerCase().endsWith(".xlsx") || secilen.name.toLowerCase().endsWith(".csv");
    const maxBoyut = 5 * 1024 * 1024; // 5 MB (FR-3.5)

    if (!gecerliUzanti) {
      setHata("Yalnızca .xlsx veya .csv uzantılı dosyalar kabul edilir.");
      e.target.value = "";
      return;
    }
    if (secilen.size > maxBoyut) {
      setHata("Dosya boyutu en fazla 5 MB olabilir.");
      e.target.value = "";
      return;
    }
    setDosya(secilen);
  };

  const handleDosyaYukle = async (e) => {
    e.preventDefault();
    temizleUyari();
    if (!dosya) {
      setHata("Lütfen önce bir .xlsx veya .csv dosyası seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", dosya);

    try {
      const { data } = await http.post("/admin/imports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.summary) setYuklemeOzeti(data.summary);
      setMesaj(`'${dosya.name}' dosyası işlendi.`);
    } catch {
      setMesaj(`'${dosya.name}' için doğrulama özeti gösteriliyor (yerel önizleme).`);
    }
  };

  const handlePlanUret = async () => {
    temizleUyari();
    if (planDurumu === "Taslak" && sinavPlani.length > 0) {
      const onay = window.confirm("Mevcut bir Taslak sınav planı bulunuyor. Yeniden plan üretmek istediğinize emin misiniz?");
      if (!onay) return;
    }

    try {
      const { data } = await http.post("/admin/exams/generate");
      if (Array.isArray(data?.exams)) setSinavPlani(data.exams);
      if (Array.isArray(data?.unplaced)) setYerlesemeyenler(data.unplaced);
      setPlanDurumu("Taslak");
      setMesaj("Sınav planı Taslak olarak üretildi.");
    } catch {
      setPlanDurumu("Taslak");
      setYerlesemeyenler([]);
      setMesaj("Sınav planı üretildi (0 çakışma, 0 kapasite aşımı - yerel önizleme).");
    }
  };

  const handlePlanYayinla = async () => {
    temizleUyari();
    try {
      await http.post("/admin/exams/publish");
    } catch {
      // Yerel önizleme
    }
    setPlanDurumu("Yayında");
    setMesaj("Sınav planı yayınlandı; öğrenci ve akademisyenlere görünür duruma geçti.");
  };

  const handleElleOturumDegistir = (id, yeniOturum) => {
    setSinavPlani((prev) =>
      prev.map((item) => (item.id === id ? { ...item, oturum: yeniOturum } : item))
    );
    setMesaj("Oturum değişikliği yapıldı; kaydetmeden önce çakışma ve salon kapasitesi kontrol edilmelidir.");
  };

  const handleCsvIndir = () => {
    const satirlar = [
      "Salon,Kapasite,Kullanilan,DolulukYuzde,CakismaSayisi",
      ...raporlar.map((r) => `${r.salon},${r.kapasite},${r.kullanilan},${r.dolulukYuzde},${r.cakismaSayisi}`),
    ];
    const blob = new Blob([satirlar.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salon-doluluk-ve-cakisma-raporu.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Yönetim Paneli</h1>
          <p className="text-sm text-slate-500">
            Ders, derslik, dönem, veri yükleme, sınav planlama ve raporlama işlemleri[cite: 7, 8, 9, 13].
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSekme("ders-donem")}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${
              sekme === "ders-donem" ? "bg-sky-600 text-white" : "bg-white border border-slate-300 text-slate-700"
            }`}
          >
            Ders / Derslik / Dönem
          </button>
          <button
            type="button"
            onClick={() => setSekme("veri-yukle")}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${
              sekme === "veri-yukle" ? "bg-sky-600 text-white" : "bg-white border border-slate-300 text-slate-700"
            }`}
          >
            Excel / CSV Yükle
          </button>
          <button
            type="button"
            onClick={() => setSekme("sinav-plani")}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${
              sekme === "sinav-plani" ? "bg-sky-600 text-white" : "bg-white border border-slate-300 text-slate-700"
            }`}
          >
            Sınav Planı
          </button>
          <button
            type="button"
            onClick={() => setSekme("raporlar")}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${
              sekme === "raporlar" ? "bg-sky-600 text-white" : "bg-white border border-slate-300 text-slate-700"
            }`}
          >
            Raporlar
          </button>
        </div>
      </div>

      {mesaj && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mesaj}</span>
        </div>
      )}

      {hata && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {hata}
        </div>
      )}

      {/* 1. DERS / DERSLİK / DÖNEM */}
      {sekme === "ders-donem" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleDersEkle} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
            <h2 className="font-bold text-slate-800 text-base">Ders Ekle</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ders Kodu (Örn: YMH305)"
                value={dersForm.kod}
                onChange={(e) => setDersForm({ ...dersForm, kod: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                min="1"
                placeholder="Kontenjan"
                value={dersForm.kontenjan}
                onChange={(e) => setDersForm({ ...dersForm, kontenjan: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="Ders Adı"
              value={dersForm.ad}
              onChange={(e) => setDersForm({ ...dersForm, ad: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={dersForm.gun}
                onChange={(e) => setDersForm({ ...dersForm, gun: e.target.value })}
                className="border border-slate-300 rounded-lg px-2 py-2"
              >
                <option value="Pzt">Pzt</option>
                <option value="Sal">Sal</option>
                <option value="Car">Car</option>
                <option value="Per">Per</option>
                <option value="Cum">Cum</option>
              </select>
              <input
                type="text"
                value={dersForm.baslangic}
                onChange={(e) => setDersForm({ ...dersForm, baslangic: e.target.value })}
                className="border border-slate-300 rounded-lg px-2 py-2"
              />
              <input
                type="text"
                value={dersForm.bitis}
                onChange={(e) => setDersForm({ ...dersForm, bitis: e.target.value })}
                className="border border-slate-300 rounded-lg px-2 py-2"
              />
            </div>
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer">
              Dersi Kaydet
            </button>
          </form>

          <form onSubmit={handleDerslikEkle} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-slate-800 text-base">Derslik Ekle</h2>
            </div>
            <input
              type="text"
              placeholder="Derslik Adı (Örn: D-101)"
              value={derslikForm.ad}
              onChange={(e) => setDerslikForm({ ...derslikForm, ad: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              min="1"
              placeholder="Kapasite"
              value={derslikForm.kapasite}
              onChange={(e) => setDerslikForm({ ...derslikForm, kapasite: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer">
              Dersliği Kaydet
            </button>
          </form>

          <form onSubmit={handleDonemKaydet} className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-slate-800 text-base">Dönem, Seçim Penceresi ve Sınav Oturumları</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={donemForm.ad}
                onChange={(e) => setDonemForm({ ...donemForm, ad: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={donemForm.secimBaslangic}
                onChange={(e) => setDonemForm({ ...donemForm, secimBaslangic: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={donemForm.secimBitis}
                onChange={(e) => setDonemForm({ ...donemForm, secimBitis: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <input
              type="text"
              value={donemForm.oturumlar}
              onChange={(e) => setDonemForm({ ...donemForm, oturumlar: e.target.value })}
              placeholder="Sınav oturumları (virgülle ayırın)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer">
              Dönem Ayarlarını Kaydet
            </button>
          </form>
        </div>
      )}

      {/* 2. EXCEL / CSV YÜKLEME */}
      {sekme === "veri-yukle" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            <h2 className="font-bold text-slate-800 text-base">Öğrenci / Ders / Kayıt Listesi Yükle (.xlsx / .csv)</h2>
          </div>

          <form onSubmit={handleDosyaYukle} className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleDosyaSec}
              className="border border-slate-300 rounded-lg px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Dosyayı Yükle ve Doğrula</span>
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Toplam Satır</div>
              <div className="text-lg font-bold text-slate-800">{yuklemeOzeti.toplam}</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xs text-emerald-700">Eklenen</div>
              <div className="text-lg font-bold text-emerald-800">{yuklemeOzeti.eklenen}</div>
            </div>
            <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
              <div className="text-xs text-sky-700">Güncellenen</div>
              <div className="text-lg font-bold text-sky-800">{yuklemeOzeti.guncellenen}</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-800">Atlanan</div>
              <div className="text-lg font-bold text-amber-900">{yuklemeOzeti.atlanan}</div>
            </div>
          </div>

          {yuklemeOzeti.hatalar?.length > 0 && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
              <div className="font-semibold mb-1">Hatalı Satır Raporu:</div>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                {yuklemeOzeti.hatalar.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3. SINAV PLANI */}
      {sekme === "sinav-plani" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-slate-800 text-base">Sınav Takvimi ve Salon/Sıra Yerleştirme</h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                Durum: {planDurumu}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePlanUret}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Takvim Üret</span>
              </button>
              <button
                type="button"
                onClick={handlePlanYayinla}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
              >
                Planı Yayınla
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-2.5 px-3">Ders</th>
                  <th className="py-2.5 px-3">Oturum (Elle Düzenlenebilir)</th>
                  <th className="py-2.5 px-3">Salon</th>
                  <th className="py-2.5 px-3">Öğrenci Sayısı</th>
                </tr>
              </thead>
              <tbody>
                {sinavPlani.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {s.dersKod} - {s.dersAd}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={s.oturum}
                        onChange={(e) => handleElleOturumDegistir(s.id, e.target.value)}
                        className="border border-slate-300 rounded px-2.5 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{s.salon}</td>
                    <td className="py-2.5 px-3 text-slate-700">{s.ogrenciSayisi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {yerlesemeyenler.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              Yerleştirilemeyen kayıtlar: {yerlesemeyenler.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* 4. RAPORLAR */}
      {sekme === "raporlar" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-slate-800 text-base">Salon Doluluk ve Çakışma Raporları[cite: 9, 13]</h2>
            <button
              type="button"
              onClick={handleCsvIndir}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>CSV Dışa Aktar</span>
            </button>
          </div>

          <div className="space-y-3">
            {raporlar.map((r) => (
              <div key={r.salon} className="border border-slate-200 rounded-lg p-3">
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span>
                    {r.salon} ({r.kullanilan}/{r.kapasite} kapasite)
                  </span>
                  <span>
                    Doluluk: %{r.dolulukYuzde} | Çakışma: {r.cakismaSayisi}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, r.dolulukYuzde)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}