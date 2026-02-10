# 🎬 Pedia - Movie App Demo

### What
TMDB API kullanarak gerçek zamanlı veri çeken; arama, filtreleme ve bilet simülasyonu özelliklerine sahip modern bir film platformu demosu.

### Why
Gerçek dünya verileriyle asenkron veri yönetimini, karmaşık UI state'lerini (pagination, filtering) ve responsive tasarımı backend ihtiyacı duymadan profesyonel bir akışla simüle etmek için.

### How
- **TMDB API Integration:** Canlı film verileri, tür listeleri ve "Now Playing" içerikleri.
- **Dynamic Navigation:** Kullanıcı yazdıkça sonuç getiren anlık arama dropdown sistemi.
- **Smart Pagination:** API limitlerini dikkate alan (max 500 sayfa), URL parametre takibi ile senkronize çalışan sayfalama yönetimi.
- **Responsive UI:** Mobil uyumlu hamburger menü ve "scrollIntoView" odaklı kullanıcı deneyimi.
- **Ticket Simulation:** Vizyondaki filmleri rastgele seans, salon ve fiyatlarla bilet kartlarına dönüştüren dinamik algoritma.

### Edge Cases & Solved Problems
- **Race Condition & State:** Hızlı sayfa değişimlerinde ve aramalarda verilerin karışmaması için `lastUrl` ve sayfa kontrol mantığı kuruldu.
- **Image Failures:** Posteri bulunmayan içerikler için Ternary Operator ile placeholder (yer tutucu) sistemi entegre edildi.
- **Navigation Logic:** Arama ve filtreleme işlemlerinin birbirini ezmemesi için event-based tetikleyiciler optimize edildi.
- **UI Resilience:** Değişken veri uzunluklarının (film özetleri, başlıklar) tasarımı bozmaması için CSS seviyesinde `ellipsis` ve `object-fit` önlemleri alındı.

### Limits
- Backend katmanı bulunmamaktadır (Bilet alımı simülasyondur).
- Veri saklama (LocalStorage) bu sürümde aktif değildir.
- API anahtarı demo amaçlı client-side tarafta sunulmaktadır.