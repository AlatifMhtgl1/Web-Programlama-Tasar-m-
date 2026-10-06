# Web Tasarımı Dersi Projesi

## Takım Üyeleri
Abdüllatif Mehtioğlu - 240502067
Hale Eslemnur Özdaşçı - 240502020

# Kampüs İyileştirme Panosu — Hafta 1

Kampüs yaşamını iyileştirecek öğrenci fikirlerinin veritabanına kaydedildiği ve yönetim tarafından takip edildiği küçük bir Flask web uygulaması. Proje, Web Tasarımı dersinin ilk hafta teslimi için anlaşılır tutulmuştur.

## Gerekenler

- Windows 10/11
- Python 3.10 veya üzeri
- İnternet bağlantısı (ilk kurulumda Python paketlerini indirmek için)

## CMD ile kurulum ve çalıştırma

1. ZIP dosyasına sağ tıklayıp **Tümünü ayıkla** seçin.
2. Başlat menüsünden **Komut İstemi (cmd)** açın.
3. Proje klasörüne geçin. Örneğin:

   ```bat
   cd /d C:\Users\KULLANICI\Downloads\web_projesi_hafta1
   ```

4. Bağımlılıkları kurun ve uygulamayı başlatın:

   ```bat
   py -m pip install -r requirements.txt
   py app.py
   ```

   `py` komutu bilgisayarınızda yoksa `python` komutunu kullanın.
5. Tarayıcıda `http://127.0.0.1:5000` adresini açın. Durdurmak için CMD penceresinde `Ctrl+C` tuşlarına basın.

İsterseniz proje klasöründeki `calistir.bat` dosyasına çift tıklayabilirsiniz. Bu dosya da paketleri kurar ve uygulamayı başlatır.

## Örnek yönetici hesabı

- E-posta: `admin@kampus.local`
- Şifre: `Admin123!`

Bu hesap uygulama ilk kez çalışırken veritabanına eklenir. Yalnızca ders demosu içindir; gerçek bir sunucuya taşınmadan önce parolayı ve `SECRET_KEY` değerini değiştirin. Veritabanı `instance/kampus_panosu.db` dosyasında tutulur.

## Uygulamadaki roller

- **Kullanıcı:** Hesap açar, giriş yapar, öneri gönderir ve önerisinin durumunu görür.
- **Süper admin:** Önerileri görüntüler ve durumlarını “Yeni”, “İnceleniyor” veya “Tamamlandı” olarak değiştirir.

Yeni kullanıcı kayıtları normal kullanıcı rolüyle açılır. Hiçbir kullanıcı kayıt formundan yönetici olamaz.

## Veritabanı şeması

- `Kullanici`: `id`, `ad_soyad`, `eposta`, `sifre` (özetlenmiş), `rol`
- `Oneri`: `id`, `baslik`, `aciklama`, `durum`, `olusturma_tarihi`, `kullanici_id`
- Bir kullanıcının birden fazla önerisi olabilir. `Oneri.kullanici_id`, `Kullanici.id` alanına bağlıdır.

Şema ve ilk hafta kapsamı için `gereksinimler.md` dosyasına bakın. İş planı `is_plani.md` dosyasındadır.

## Klasör yapısı

```text
web_projesi_hafta1/
├── app.py
├── requirements.txt
├── README.md
├── gereksinimler.md
├── is_plani.md
├── calistir.bat
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── giris.html
│   ├── kayit.html
│   └── admin.html
└── static/
    └── style.css
```

## GitHub'a yükleme

GitHub'da ders projeniz için yeni bir repository oluşturduktan sonra bu klasörde CMD açın ve aşağıdaki komutları kendi repository adresinizle çalıştırın:

```bat
git init
git add .
git commit -m "Ilk hafta Flask proje altyapisi"
git branch -M main
git remote add origin https://github.com/KULLANICI/REPOSITORY.git
git push -u origin main
```

GitHub adresini ve öğrenci bilgilerinizi README'ye ekleyin. Gerçek parola veya kişisel veri yüklemeyin.

## Ders sunumunda anlatabileceğim kısa özet

“Projem Kampüs İyileştirme Panosu. SQLite veritabanında kullanıcı ve öneri tabloları var. Kullanıcıların şifrelerini açık metin olarak değil, Werkzeug ile oluşturulan parola özeti olarak saklıyorum. Oturum açan kullanıcının kimliğini session'da tutuyorum. Yönetici rotasında rolü ayrıca kontrol ediyorum. Bu haftaki sürüm kayıt, giriş, öneri ekleme ve öneri durumunu güncelleme akışını gösteriyor.”

## Sonraki haftalara bırakılan işler

İş planında yer alan kapsamlı kullanıcı yönetimi, dosya ekleri, bildirimler, sunucuya yayınlama ve test ekibinin hata raporu sonraki haftalarda geliştirilecek. İlerideki test aşamasında bulunacak hatalar önceden varmış gibi gösterilmemelidir; bulunan her hata tekrarlanabilir adımlarıyla kaydedilmelidir.
