# Proje gereksinimleri — ilk hafta

## Proje tanımı

**Adı:** Kampüs İyileştirme Panosu  
**Türü:** Veritabanı kullanan, oturum açmalı ve rol tabanlı web uygulaması.  
**Amaç:** Öğrencilerin kampüsle ilgili fikirlerini tek yerde paylaşması; yönetimin bu fikirleri takip edip durum güncellemesi.

## Kullanıcılar ve yetkiler

| Rol | Yetkiler |
| --- | --- |
| Kullanıcı | Hesap oluşturma, giriş/çıkış, öneri gönderme, kendi önerilerini ve durumlarını görme |
| Süper admin | Admin panelini görme, tüm önerileri ve gönderen kişiyi görme, öneri durumunu güncelleme |

Kayıt formu yeni hesapları daima `kullanici` rolünde oluşturur. Süper admin hesabı ilk açılışta yalnızca başlangıç verisi olarak eklenir.

## İşlevsel gereksinimler

1. Uygulama ana sayfayı göstermelidir.
2. Ziyaretçi ad, e-posta ve parola ile hesap oluşturabilmelidir.
3. E-posta adresi benzersiz olmalıdır; parola özeti veritabanında saklanmalıdır.
4. Kullanıcı doğru e-posta ve parola ile oturum açıp kapatabilmelidir.
5. Giriş yapan kullanıcı başlık ve açıklamayla kampüs önerisi ekleyebilmelidir.
6. Kullanıcı sadece kendi önerilerini ve durumlarını görmelidir.
7. Süper admin ayrı bir sayfada bütün önerileri görüp durumlarını güncelleyebilmelidir.
8. Yetkisiz kullanıcı admin adresine erişememelidir.

## Teknik gereksinimler

- Python 3.10+, Flask, Flask-SQLAlchemy ve SQLite kullanılacaktır.
- Sayfalar Jinja şablonlarıyla üretilecektir; arayüz CSS ile düzenlenecektir.
- Giriş durumu Flask session içinde izlenecektir.
- Parolalar Werkzeug `generate_password_hash` ve `check_password_hash` işlevleriyle yönetilecektir.
- SQLite veritabanı uygulama içindeki `instance` klasöründe oluşturulacaktır.
- Kod modüllere bölünmeden, ilk hafta için tek bir `app.py` içinde sade tutulmuştur.

## Veri modeli

### Kullanici

| Alan | Tür | Kural |
| --- | --- | --- |
| id | Integer | Birincil anahtar |
| ad_soyad | String(80) | Boş olamaz |
| eposta | String(120) | Boş olamaz, benzersiz |
| sifre | String(255) | Boş olamaz, parola özeti |
| rol | String(20) | `kullanici` veya `super_admin` |

### Oneri

| Alan | Tür | Kural |
| --- | --- | --- |
| id | Integer | Birincil anahtar |
| baslik | String(120) | Boş olamaz |
| aciklama | Text | Boş olamaz |
| durum | String(20) | `Yeni`, `İnceleniyor` veya `Tamamlandı` |
| olusturma_tarihi | DateTime | Oluşturulma zamanı |
| kullanici_id | Integer | Kullanici tablosuna yabancı anahtar |

İlişki: Bir kullanıcı çok sayıda öneri gönderebilir; her öneri tek bir kullanıcıya aittir.

## İlk hafta teslim kontrol listesi

- [x] Proje fikri ve ilk teknik gereksinimler belirlendi.
- [x] Flask ve SQLite iskeleti oluşturuldu.
- [x] Kullanıcı ve öneri veri modeli yazıldı.
- [x] Giriş, kayıt, oturum ve rol kontrolü eklendi.
- [x] Çalıştırma yönergesi ve anlaşılır klasör yapısı hazırlandı.
- [x] En az beş iş paketli haftalık plan hazırlandı.
- [ ] GitHub repository adresi öğrenci tarafından açılıp bu klasör gönderilecek.

GitHub hesabı/repository bilgisi verilmediği için proje dosyaları hazırlandı; dış hesapta repo oluşturma veya yükleme bu paketin parçası değildir. Nasıl yükleneceği README'de verilmiştir.
