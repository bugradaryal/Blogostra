# MyBlog — Frontend

Blog platformunun React arayüzü. Okuyucular yazıları arayıp kategoriye göre filtreleyebilir, beğenebilir ve yorum yapabilir. Yönetici; yazı, yorum ve kullanıcıları yönetir, istatistik grafiklerini görür. Arayüz Türkçe ve İngilizce, açık ve koyu temalıdır.

> Proje adı geçicidir (`MyBlog`). Repo adı belli olunca güncellenecek.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Mimari](#mimari)
- [Kimlik doğrulama akışı](#kimlik-doğrulama-akışı)
- [Tasarım sistemi](#tasarım-sistemi)
- [SEO ve analitik](#seo-ve-analitik)
- [Klasör yapısı](#klasör-yapısı)
- [Kurulum ve çalıştırma](#kurulum-ve-çalıştırma)
- [Ortam değişkenleri](#ortam-değişkenleri)
- [Kullanılan API uç noktaları](#kullanılan-api-uç-noktaları)
- [Bilinen sınırlar](#bilinen-sınırlar)

## Özellikler

- Yazı listesi, sayfalama, arama ve kategoriye göre filtreleme
- Yazı detayı, beğeni ve yorum
- Kayıt, e-posta doğrulama, giriş, çıkış
- Hesap sayfası: profil düzenleme, şifre değiştirme, hesap silme
- Yönetici paneli: yazı ekleme/düzenleme/silme, yorum silme, kullanıcı askıya alma, aylık yazı/yorum/beğeni grafikleri
- Rol tabanlı sayfa koruma (anonim, kullanıcı, yönetici)
- Türkçe / İngilizce arayüz, açık / koyu tema (tercihler kalıcı)
- Kategori renklerine dayalı kimlik; görseli olmayan yazılar için renkli tipografik kapak
- SEO etiketleri, temiz yazı adresleri, sitemap ve robots.txt
- Google Analytics 4, çerez onayı olmadan çalışmaz (KVKK)

## Teknolojiler

| Alan          | Seçim                                                            |
| ------------- | ---------------------------------------------------------------- |
| Derleyici     | Vite 8                                                           |
| Dil           | TypeScript 5.9 (`strict`)                                        |
| UI            | React 18, React Router 7                                         |
| Stil          | Tailwind CSS 4, lucide-react                                     |
| Sunucu durumu | TanStack Query 5                                                 |
| HTTP          | axios (iki instance, interceptor)                                |
| Çoklu dil     | i18next, react-i18next                                           |
| Grafik        | recharts                                                         |
| SEO           | react-helmet-async                                               |
| Kalite        | ESLint (typescript-eslint, react-hooks, react-refresh), Prettier |

## Mimari

- **`api/`**: Tüm HTTP çağrıları burada. Bileşenler axios'u doğrudan görmez. İki instance var: `api` (herkese açık) ve `authApi` (token ekler, 401'de oturumu yeniler).
- **`hooks/`**: TanStack Query sarmalayıcıları. Sorgu anahtarları tek dosyada (`queryKeys.ts`); yazı ekleme/silme/güncelleme sonrası ilgili listeler geçersiz kılınır.
- **`auth/`**: `AuthProvider` oturumu (kullanıcı, rol) tutar; `RequireAuth` bir layout route olarak sayfaları korur. Giriş yapmamış kullanıcı `/Login`'e yönlenir ve girişten sonra geldiği sayfaya döner; yetkisiz rol ana sayfaya gider.
- **`context/`**: Tema ve çerez onayı birer context. Her biri Context, Provider ve hook dosyalarına ayrıldı.
- **Veri akışı**: sayfa → hook → `api/` fonksiyonu → axios → backend.
- Yönetici sayfaları `React.lazy` ile ayrı parçalara bölündü; grafik kütüphanesi yalnızca grafik sayfası açılınca yüklenir.

## Kimlik doğrulama akışı

1. Giriş yanıtındaki `authorization` ve `refreshtoken` başlıkları `localStorage`'a yazılır.
2. Sayfa açılırken access token süresi dolmuşsa önce yenilenir, sonra `/Auth/ValidateToken` ile kullanıcı ve rol alınır.
3. Korumalı bir istek 401 dönerse interceptor refresh token ile yeni çift alır ve isteği bir kez tekrarlar.
4. Aynı anda birden çok istek 401 alırsa tek bir yenileme isteği yapılır, diğerleri sonucu bekler (single-flight).
5. Yenileme başarısız olursa tokenlar silinir, oturum kapanır ve kullanıcı giriş sayfasına yönlenir.

## Tasarım sistemi

- Renkler ve yarıçaplar `src/styles/index.css` içinde CSS değişkenleri (oklch). Koyu tema aynı değişkenleri `.dark` sınıfı altında değiştirir; bileşenlerde `dark:` yazmaya gerek kalmaz. `index.html` içindeki küçük bir script, sayfa açılırken tema yanıp sönmesini önler.
- Her kategorinin bir tonu vardır (`data-category`). Kategori noktası, kapak ve beğeni rengi bu tondan türer.
- Yazı tipleri: Bricolage Grotesque (arayüz, başlık) ve Literata (okuma metni), kendi sunucumuzdan (`@fontsource-variable`).
- Stil doğrudan Tailwind sınıfıyla yazılır. Tekrar eden birkaç sınıf (buton, input, tablo) `src/lib/classes.ts` içinde tutulur. Açılır pencere tarayıcının kendi `<dialog>`, seçim kutusu `<select>`, tablo `<table>` öğesidir; harici arayüz kütüphanesi yoktur.

## SEO ve analitik

- Her sayfa başlık, açıklama, canonical ve Open Graph etiketlerini `Seo` bileşeniyle yazar. Giriş, kayıt, hesap ve yönetici sayfaları `noindex`.
- Yazılar `/post/12/istanbul-notlari` biçiminde adreslenir. Slug Türkçe karakterleri sadeleştirir.
- `npm run build` öncesinde `scripts/generate-seo-files.mjs`, `VITE_SITE_URL` ile `sitemap.xml` ve `robots.txt` üretir.
- GA4 yalnızca `VITE_GA_ID` doluysa ve kullanıcı çerez bandında kabul ettiyse yüklenir. SPA geçişleri için `page_view` olayı elle gönderilir. Tercih footer'dan değiştirilebilir.

## Klasör yapısı

```
src/
  api/          axios instance'ları, endpoint fonksiyonları, token saklama
  auth/         AuthProvider, RequireAuth, oturum yükleme
  components/   Comment, PostCard, Pager, Field, Modal, CategorySelect, CookieBanner, Seo, RouteTracker
    layout/     Header, Footer
  constants/    kategoriler, sayfalama, site adı
  context/      tema ve çerez onayı context'leri
  hooks/        TanStack Query hook'ları, sorgu anahtarları
  i18n/         i18next ayarı, locales/en ve locales/tr
  lib/          queryClient, ortak Tailwind sınıfları, GA4 yükleme
  pages/        Home, Blog, Login, Register, Account, About, Contact,
                EmailVerification, NotFound
    admin/      Users, Chart, Posts (PostManager, AddPost, ManageComments)
  styles/       Tailwind girişi ve tema değişkenleri
  types/        paylaşılan tipler
  utils/        tarih, görsel, slug, dil, hata, token yardımcıları
scripts/        sitemap ve robots üretici
docs/           faz faz teknik notlar
```

## Kurulum ve çalıştırma

Gereksinimler: Node.js 22 ve çalışan backend.

```
npm install
cp .env.example .env
npm run dev
```

Geliştirme sunucusu `http://localhost:3000` adresinde açılır. Bu port backend'in CORS ayarıyla aynı olmalıdır.

| Komut             | Açıklama                                                 |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Geliştirme sunucusu                                      |
| `npm run build`   | Tip kontrolü, sitemap/robots üretimi ve üretim derlemesi |
| `npm run preview` | Derlemeyi yerelde sunar                                  |
| `npm run lint`    | ESLint                                                   |
| `npm run format`  | Prettier                                                 |

## Ortam değişkenleri

| Değişken        | Açıklama                                                   |
| --------------- | ---------------------------------------------------------- |
| `VITE_API_URL`  | Backend adresi (ör. `https://localhost:7197/api`)          |
| `VITE_SITE_URL` | Sitenin yayın adresi; canonical, sitemap ve robots için    |
| `VITE_GA_ID`    | GA4 ölçüm kimliği. Boşsa analitik ve çerez bandı kapalıdır |

## Kullanılan API uç noktaları

| Grup    | Uç noktalar                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| Auth    | `Register`, `Login`, `RefreshToken`, `ValidateToken`, `SendMail`, `Emailverification`                            |
| Post    | `GetAllPostsByIndex`, `GetPostBySearch`, `GetPostCounts`, `GetPostById`, `LikeThePost`, `DislikeThePost`         |
| Comment | `AddCommentToPost`                                                                                               |
| User    | `UpdateAccount`, `ChangePassword`, `DeleteAccount`                                                               |
| Admin   | `GetAllUsers`, `SuspendUser`, `GetAllStatistics`, `AddPost`, `UpdatePost`, `RemovePost`, `DeleteCommentFromPost` |

## Bilinen sınırlar

- Uygulama Vite SPA'dır. Google sayfaları çalıştırıp okuyabilir, ancak link önizleme botları (Twitter, WhatsApp) yazıya özel önizleme göstermez. Kalıcı çözüm SSR veya pre-render olurdu.
- `GetPostById` uç noktası backend'e eklenmelidir; eklenene kadar yazıya doğrudan linkle girilemez (listeden açılış çalışır).
- Sitemap şimdilik yalnızca sabit sayfaları içerir; yazı adresleri için backend'de bir liste uç noktası gerekir.
- Projede otomatik test yoktur. Geliştirme sırasında akışlar (giriş, yetki, token yenileme, filtreleme, çerez onayı) sahte API ile tarayıcıda elle doğrulandı.
- Token'lar `localStorage`'da tutulur; XSS'e karşı `httpOnly` çerez daha güvenlidir, bu bilinçli bir sadeleştirmedir.
