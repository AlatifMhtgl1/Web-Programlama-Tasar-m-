# Proje Gereksinimleri — İlk Hafta

## Proje Tanımı

**Adı:** Kampüs Kayıp Eşya ve Buluntu Platformu  
**Türü:** Veritabanı kullanan, oturum açmalı ve rol tabanlı web uygulaması.  
**Amaç:** Kampüs içerisinde öğrencilerin ve personelin kaybettikleri veya buldukları eşyaları dijital bir panoda yönetmelerini sağlamak; bulunan eşyaların güvenli bir şekilde (kampüs güvenliği moderatörlüğünde) asıl sahiplerine ulaştırılacağı merkezi bir arşiv oluşturmak.

---

## Kullanıcılar ve Yetkiler

| Rol | Yetkiler |
| --- | --- |
| **Kullanıcı** (Öğrenci/Personel) | Hesap oluşturma, giriş/çıkış, eşya ilanı (kayıp/buluntu) ekleme, kendi ilanlarını düzenleme ve durumunu (beklemede, onaylandı, vb.) görme. |
| **Süper Admin** (Güvenlik) | Admin panelini görme, tüm ilanları inceleme, ilanları onaylama/reddetme/yayından kaldırma, sistemdeki eşya kategorilerini yönetme. |

> **Not:** Kayıt formu yeni hesapları daima standart `Kullanıcı` rolünde oluşturur. Süper admin hesabı veritabanı kurulumunda başlangıç verisi (seed data) olarak eklenecektir.

---

## İşlevsel Gereksinimler

1. Uygulama, onaylanmış kayıp ve buluntu eşyaların listelendiği ana sayfayı göstermelidir.
2. Ziyaretçi; ad, e-posta ve parola ile hesap oluşturabilmelidir.
3. E-posta adresi benzersiz olmalıdır; parolalar veritabanında şifrelenmiş (hash) olarak saklanmalıdır.
4. Kullanıcı doğru e-posta ve parola ile oturum açıp kapatabilmelidir.
5. Giriş yapan kullanıcı; görsel, başlık, açıklama ve kategori seçerek "Kayıp" veya "Buldum" ilanı ekleyebilmelidir.
6. Kullanıcı sadece kendi açtığı ilanları düzenleyebilmeli ve durumunu takip edebilmelidir.
7. Süper admin, ayrı bir admin sayfasında bütün ilanları görüp durumlarını (Onaylandı/Reddedildi) güncelleyebilmelidir.
8. Yetkisiz kullanıcılar admin sayfalarına erişememelidir.

---

## Teknik Gereksinimler

- **Backend & Veritabanı:** C# .NET Core (MVC veya Web API), Entity Framework Core ve MS SQL Server kullanılacaktır.
- **Frontend:** Arayüz React ile oluşturulacak, backend ile entegre edilecektir.
- **Kimlik Doğrulama:** Oturum yönetimi, giriş durumu ve yetkilendirme işlemleri ASP.NET Core Identity kütüphanesi ile izlenecektir.
- **Güvenlik:** Parolalar ASP.NET Core Identity'nin yerleşik `PasswordHasher` algoritmasıyla güvenli hale getirilecektir.
- **Mimari:** Proje kodları MVC mimarisine uygun olarak `Controllers`, `Models` ve `Views` klasörleri şeklinde modüler olarak yapılandırılacaktır.

---

## Veri Modeli

### Kullanici (Users)

| Alan | Tür | Kural |
| --- | --- | --- |
| `id` | Integer/Guid | Birincil anahtar |
| `ad_soyad` | String(80) | Boş olamaz |
| `eposta` | String(120) | Boş olamaz, benzersiz |
| `sifre_hash` | String(Max) | Boş olamaz, parola özeti |
| `rol` | String(20) | `Kullanıcı` veya `Super_Admin` |

### Kategori (Categories)

| Alan | Tür | Kural |
| --- | --- | --- |
| `id` | Integer | Birincil anahtar |
| `ad` | String(50) | Boş olamaz (Örn: Elektronik, Kırtasiye, Kimlik) |

### Ilan (Items)

| Alan | Tür | Kural |
| --- | --- | --- |
| `id` | Integer | Birincil anahtar |
| `baslik` | String(120) | Boş olamaz |
| `aciklama` | Text | Boş olamaz |
| `ilan_turu` | String(20) | `Kayıp` veya `Buluntu` |
| `durum` | String(20) | `Beklemede`, `Onaylandı`, `Reddedildi` veya `Teslim Edildi` |
| `gorsel_url` | String(255)| Opsiyonel |
| `olusturma_tarihi` | DateTime | Oluşturulma zamanı |
| `kategori_id` | Integer | Kategori tablosuna yabancı anahtar |
| `kullanici_id` | Integer/Guid | Kullanici tablosuna yabancı anahtar |

> **İlişki (Relation):** Bir kullanıcı birden fazla ilan açabilir (1-N). Bir kategoriye ait birden fazla ilan olabilir (1-N).

---

## İlk Hafta Teslim Kontrol Listesi

- [x] Proje fikri ve ilk teknik gereksinimler belirlendi.
- [x] Projenin amacı ve okula faydası tanımlandı.
- [x] Kullanıcı ve ilan veri modeli (tablo yapıları) tasarlandı.
- [x] En az beş iş paketli haftalık proje planı (README içinde) hazırlandı.
- [x] GitHub repository adresi açıldı ve dokümantasyon dosyaları eklendi.
- [ ] .NET Core ve SQL Server iskeleti oluşturulup kodlar repoya yüklenecek (İlerleyen haftanın görevi).
- [ ] Kimlik doğrulama, arayüz ve admin paneli kodlamasına başlanacak.
