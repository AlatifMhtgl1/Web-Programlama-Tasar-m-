# İş planı çizelgesi

Proje: **Kampüs İyileştirme Panosu**  
Plan, dersin üç sunumunu ve altı haftalık geliştirme akışını kapsar. İki kişilik ekipte görevler iki öğrenci arasında bölünür; bireysel çalışmada iki görev alanı aynı öğrenci tarafından sırayla yürütülür.

| İş paketi | Hafta | Yapılacak işler | Sorumlu / paylaşım | Teslim ve kontrol |
| --- | --- | --- | --- | --- |
| 1. Gereksinim ve altyapı | 1 | Fikri seçme, gereksinimleri yazma, GitHub reposu açma, Flask/SQLite kurulumu, tablo tasarımı, temel giriş ve rol iskeleti | Öğrenci A: gereksinim ve veri modeli; Öğrenci B: Flask iskeleti ve arayüz. Bireyselde aynı öğrenci | Gereksinimler, ER ilişki özeti, çalışan ana sayfa ve ilk repo yüklemesi |
| 2. Hesap ve yetkilendirme | 2 | Kayıt, giriş/çıkış, parola özeti, oturum kontrolleri, normal kullanıcı ve admin ayrımı | A: hesap akışları; B: erişim kontrolü ve arayüz; birlikte gözden geçirme | Kayıt ve giriş demosu |
| 3. Öneri akışı ve sunum | 3 | Öneri gönderme, kullanıcıya kendi önerilerini gösterme, admin durum güncelleme, sunum senaryosu hazırlama | A: veritabanı işlemleri; B: admin ve kullanıcı ekranı; birlikte canlı kodlama alıştırması | 1. sunum: çalışan dikey akış ve hocanın anlık ekleme isteğine hazır kod |
| 4. Arayüz ve kullanıcı deneyimi | 4 | Form doğrulama, telefon görünümü, hata/başarı mesajları ve ekran iyileştirmeleri | A: kullanım senaryoları; B: CSS ve şablon; bireyselde tek öğrenci | 2. sunum: arayüz ve temel özellik gösterimi |
| 5. Yönetim özellikleri | 5 | Önerileri arama/filtreleme, kullanıcı yönetimi ihtiyacını değerlendirme, kullanım kılavuzunu güncelleme | A: özellik ve veri kontrolü; B: ekranlar ve dokümantasyon | Geliştirme sürümü, kısa kullanıcı kılavuzu |
| 6. Test, hata raporu ve son sunum | 6 ve sonrası | Test ekibiyle senaryoları çalıştırma, gerçek hataları yeniden üretme, önem sırasına koyup düzeltme, son sunuma hazırlanma | A: test kayıtları; B: düzeltmeler; her hata birlikte doğrulanır | 3. sunum ve test raporu |

## Test ekibinin hata raporunda tutulacak bilgiler

Hata adedi sistemde gerçekten gözlenen ve tekrarlanabilen hatalardan oluşmalıdır. Hata yoksa sayı uydurulmaz. Her kayıt: numara, tarih, test eden kişi, sayfa/özellik, ön koşul, izlenen adımlar, beklenen sonuç, gerçekleşen sonuç, önem seviyesi, ekran görüntüsü ve düzeltme durumunu içermelidir. Hoca en az 100 hata istediği için altıncı haftadan sonra yeterli test süresi ve test senaryosu planlanmalıdır.

## Sunum takvimi

Sunum tarihleri hoca tarafından açıklanınca takvime eklenecek. Üçüncü hafta sunumunda kodun temel akışını açıklamak ve küçük değişiklikleri tahtada yapabilmek için her öğrenci düzenli kod anlatımı çalışması yapacak.
