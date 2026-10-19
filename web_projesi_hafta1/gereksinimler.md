Proje Gereksinimleri — İlk Hafta

Proje Tanımı
Adı: Kampüs Yemekhane ve Öğrenci Geri Bildirim Sistemi
Türü: Veritabanı kullanan, oturum açmalı ve rol tabanlı web uygulaması.
Amaç: Güncel yemekhane menülerini öğrencilerin kolayca görüntülemesini; yemekler için puan ve yorum göndermesini; yemekhane yönetiminin menüleri ve öğrenci geri bildirimlerini tek bir sistemden yönetmesini sağlamak.
Kullanıcılar ve Yetkiler
Rol	Yetkiler
Öğrenci	Hesap oluşturma ve giriş/çıkış; günlük veya haftalık menüyü görüntüleme; yemeklere 1–5 arasında puan verme ve yorum yazma; kendi geri bildirimlerini görüntüleme.
Yemekhane Yöneticisi	Menü ve yemek ekleme, düzenleme ve silme; öğrenci geri bildirimlerini ve yemeklerin puan ortalamalarını inceleme.
Süper Admin	Kullanıcı ve rol yönetimi; sistem genelinde yönetim yetkileri.


Not: Kayıt formu yeni hesapları varsayılan olarak Öğrenci rolünde oluşturmalıdır. Yönetici ve süper admin hesapları yetkili şekilde tanımlanmalıdır.

İşlevsel Gereksinimler
1. Uygulama günlük ve haftalık yemekhane menülerini göstermelidir.
2. Ziyaretçi ad, e-posta ve parola ile hesap oluşturabilmelidir.
3. E-posta adresi benzersiz olmalı; parolalar veritabanında güvenli biçimde hash’lenmiş olarak saklanmalıdır.
4. Kullanıcı doğru e-posta ve parola ile oturum açıp kapatabilmelidir.
5. Öğrenciler menüdeki yemekleri görüntüleyebilmelidir.
6. Öğrenciler yemeklere 1–5 arasında puan verebilmeli ve yorum yazabilmelidir.
7. Öğrenciler kendi geri bildirimlerini görüntüleyebilmelidir.
8. Yemekhane yöneticisi yemek ve menü kayıtlarını ekleyebilmeli, düzenleyebilmeli ve silebilmelidir.
9. Yemekhane yöneticisi geri bildirimleri ve yemeklerin puan ortalamalarını inceleyebilmelidir.
10. Yetkisiz kullanıcıların yönetim işlemleri backend tarafında engellenmelidir.
Fonksiyonel Olmayan Gereksinimler
- Güvenlik: Parolalar düz metin olarak tutulmamalı; rol ve yetki kontrolleri backend’de uygulanmalıdır.
- Kullanılabilirlik: Arayüz sade, anlaşılır ve mobil cihazlarda kullanılabilir olmalıdır.
- Performans: Menü ve geri bildirim ekranları makul sürede açılmalıdır.
- Veri bütünlüğü: Zorunlu alanlar doğrulanmalı; puanlar 1–5 aralığında olmalıdır.
- Bakım yapılabilirlik: React arayüzü, ASP.NET Core API ve veritabanı sorumlulukları ayrılmalıdır.
İlk sürüm kapsamı dışında: Ödeme işlemleri, yemekhane kartı entegrasyonu ve canlı stok takibi.
Teknik Gereksinimler
- Backend: C# ve ASP.NET Core Web API
- Frontend: React ve CSS
- Veritabanı: Microsoft SQL Server (MSSQL)
- Veri erişimi: Entity Framework Core
- API iletişimi: React ile backend arasında JSON üzerinden iletişim
- Kimlik doğrulama ve yetkilendirme: Oturum açma ve rol kontrolleri backend’de yürütülmelidir.
Veri Modeli
Kullanıcılar (Users)
Alan	Tür	Kural
id	Integer veya Guid	Birincil anahtar
ad_soyad	String(80)	Boş olamaz
eposta	String(120)	Boş olamaz, benzersiz
sifre_hash	String(Max)	Boş olamaz, parola özeti
rol	String(30)	Öğrenci, Yemekhane_Yoneticisi veya Super_Admin


Yemekler (Foods)
Alan	Tür	Kural
id	Integer	Birincil anahtar
ad	String(100)	Boş olamaz
aciklama	Text	Opsiyonel


Menüler (Menus)
Alan	Tür	Kural
id	Integer	Birincil anahtar
tarih	DateTime	Menü tarihi
ogun	String(30)	Öğün bilgisi
yemek_id	Integer	Foods tablosuna yabancı anahtar


Geri Bildirimler (Feedbacks)
Alan	Tür	Kural
id	Integer	Birincil anahtar
yemek_id	Integer	Foods tablosuna yabancı anahtar
kullanici_id	Integer veya Guid	Users tablosuna yabancı anahtar
puan	Integer	1–5 arasında olmalı
yorum	Text	Boş bırakılabilir
olusturma_tarihi	DateTime	Geri bildirim zamanı


İlişkiler: Bir yemek farklı menülerde yer alabilir ve birden fazla geri bildirim alabilir. Bir kullanıcı birden fazla geri bildirim gönderebilir. Menü ile yemek arasındaki ilişki, bir menüde birden fazla yemek bulunmasını destekleyecek şekilde modellenmelidir.

İlk Hafta Teslim Kontrol Listesi
- Proje fikri ve ilk teknik gereksinimler belirlendi.
- Projenin amacı ve kampüse sağlayacağı fayda tanımlandı.
- Kullanıcı, yemek, menü ve geri bildirim veri modelleri tasarlandı.
- En az beş iş paketinden oluşan haftalık proje planı README dosyasına eklendi.
- GitHub deposu açıldı ve dokümantasyon dosyaları eklendi.
- .NET Core ve SQL Server iskeletinin oluşturulması sonraki haftanın görevi olarak planlandı.
- Kimlik doğrulama, arayüz ve yönetim ekranlarının geliştirilmesi sonraki aşamalara planlandı.
