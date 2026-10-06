# web-programlama-proje
Kampüs Kayıp Eşya ve Buluntu Platformu

Bu proje, üniversite kampüsü içerisinde öğrencilerin ve personelin kaybettikleri veya buldukları eşyaları dijital bir panoda yönetmelerini sağlayan, rol tabanlı ve interaktif bir web uygulamasıdır.

## Proje Amacı ve Okula Faydası
Kampüs içindeki WhatsApp gruplarında veya öğrenci işleri panolarında yaşanan bilgi kirliliğini önlemek; bulunan eşyaların güvenli bir şekilde (kampüs güvenliği moderatörlüğünde) asıl sahiplerine ulaştırılmasını sağlayan merkezi bir dijital arşiv oluşturmaktır.

## Kullanılan Teknolojiler
* **Backend:** .NET Core (MVC / Web API)
* **Veritabanı:** MS SQL Server & Entity Framework Core
* **Kimlik Doğrulama:** ASP.NET Core Identity (Role-Based Authorization)
* **Arayüz:** Bootstrap / HTML / CSS

## Kullanıcı Rolleri ve Yetkiler
1. **Süper Admin (Güvenlik / Öğrenci İşleri):** Tüm sistemi yönetir. Kullanıcıların açtığı "Kayıp" veya "Buluntu" ilanlarını onaylar, reddeder veya yayından kaldırır. Sistemdeki eşya kategorilerini yönetir.
2. **Kullanıcı (Öğrenci / Personel):** Sisteme kayıt olur, görsel yükleyerek eşya ilanı (Kayıp veya Buldum) oluşturur. İlanlarının durumunu (Beklemede, Onaylandı, Teslim Edildi) takip eder.

## İş Planı (Work Packages)

| İş Paketi | Kapsam ve Açıklama |
| :--- | :--- |
| **WP1: Veritabanı ve Proje Mimarisinin Kurulumu** | GitHub reposunun açılması, .NET iskeletinin oluşturulması, Users, Items, Categories tablolarının (ERD) tasarlanması. |
| **WP2: Kimlik Doğrulama (Identity)** | Admin ve Standart Kullanıcı rollerinin sisteme entegrasyonu, güvenli Login/Register ekranlarının yapılması. |
| **WP3: İlan Yönetimi ve Admin Paneli** | Eşya ekleme, silme, güncelleme işlemlerinin kodlanması ve Admin onayı (Approve/Reject) yapısının kurulması. |
| **WP4: Görsel Arayüz (Frontend) Entegrasyonu** | Kullanıcıların ilanları filtreleyebileceği (Tarih, Kategori, Kayıp/Buluntu durumuna göre) etkileşimli listeleme ekranlarının tasarımı. |
| **WP5: Test (Bug Hunting) & Hata Raporlama** | Kapsamlı senaryo testleriyle en az 100 hatanın tespit edilmesi, raporlanması ve kodun sunuma hazır hale getirilmesi. |
