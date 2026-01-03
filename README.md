# FlashMock: Hızlı ve Esnek API Mock Sunucusu

![FlashMock Logo](https://img.shields.io/badge/FlashMock-API_Mocking-blueviolet?style=for-the-badge&logo=react)
![Hono](https://img.shields.io/badge/Hono-fast_web_framework-blue?style=for-the-badge&logo=hono)
![TypeScript](https://img.shields.io/badge/TypeScript-Strongly_Typed-blue?style=for-the-badge&logo=typescript)
![Chokidar](https://img.shields.io/badge/Chokidar-File_Watching-green?style=for-the-badge&logo=chokidar)
![Cac](https://img.shields.io/badge/CAC-CLI_Framework-orange?style=for-the-badge)

FlashMock, geliştiricilerin yerel ortamda hızla ve kolayca API mock'ları oluşturmasını sağlayan açık kaynaklı bir CLI aracıdır. Karmaşık sunucu kurulumlarına gerek kalmadan, sadece bir klasöre JSON veya TypeScript dosyaları yerleştirerek anında bir REST API simülasyonu başlatın. Ayrıca, mock'larınızı web arayüzü üzerinden yönetmenizi ve hazır şablonlarla hızla başlamanızı sağlayan güçlü bir UI ile birlikte gelir.

## ✨ Özellikler

*   **Dosya Tabanlı Yönlendirme:** `./mocks` klasörünüzdeki dosya yapısı, API endpoint'lerini otomatik olarak oluşturur.
    *   `mocks/users/GET.json` -> `GET /users`
    *   `mocks/products/POST.json` -> `POST /products`
    *   `mocks/users/[id]/GET.json` -> `GET /users/:id` (Dinamik route desteği)
*   **Dinamik JS/TS Handler Desteği:** Sadece JSON değil, TypeScript/JavaScript dosyalarıyla (örneğin `mocks/auth/login/POST.ts`) dinamik yanıtlar döndüren Hono handler'ları oluşturabilirsiniz.
*   **Sıcak Yeniden Yükleme (Hot Reload):** `mocks` klasöründe yapılan değişiklikler (dosya ekleme, silme, düzenleme) sunucuyu otomatik olarak günceller, yeniden başlatmaya gerek kalmaz.
*   **CORS Desteği:** Geliştirme kolaylığı için tüm API isteklerine varsayılan olarak izin verilir.
*   **Web Tabanlı Yönetim Arayüzü (UI):** Mock dosyalarınızı görsel bir arayüz üzerinden CRUD (Create, Read, Update, Delete) işlemleriyle yönetin.
*   **Hazır Şablonlar:** E-ticaret, okul yönetimi gibi senaryolara özel önceden hazırlanmış şablonları UI üzerinden tek tıkla uygulayarak hızla mock verileri oluşturun.

## 🚀 Teknoloji Yığını

*   **Dil:** TypeScript (Node.js)
*   **Web Sunucusu:** Hono (Hafif ve hızlı)
*   **CLI Framework:** Cac
*   **Dosya İzleme:** Chokidar
*   **Renkli Loglar:** Picocolors
*   **Dosya İşlemleri:** `fs-extra`

## 📦 Kurulum

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/your-username/flashmock.git
    cd flashmock
    ```
    (Henüz GitHub'da değilse bu adımı atlayın)

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **CLI Komutunu Global Yapın (Önerilir):**
    `flashmock` komutunu sisteminizin herhangi bir yerinden kullanabilmek için:
    ```bash
    npm link
    ```

## 💡 Kullanım

FlashMock iki ana komut sunar: mock sunucusu için `start` ve yönetim arayüzü için `ui`.

### 1. Mock Sunucusunu Başlatma

```bash
flashmock start [options]
```

**Seçenekler:**

*   `--port <port>`: Sunucunun dinleyeceği portu belirtir (Varsayılan: `3000`).

**Örnek:**
```bash
flashmock start --port 8080
```

Mock sunucusu başladıktan sonra, `http://localhost:3000` (veya belirttiğiniz port) üzerinden mock API'lerinize erişebilirsiniz.

### 2. Yönetim Arayüzünü (UI) Başlatma

```bash
flashmock ui [options]
```

**Seçenekler:**

*   `--port <port>`: UI sunucusunun dinleyeceği portu belirtir (Varsayılan: `3001`).

**Örnek:**
```bash
flashmock ui --port 8081
```

UI sunucusu başladıktan sonra, `http://localhost:3001` (veya belirttiğiniz port) üzerinden web arayüzüne erişebilirsiniz.

## 📂 Dosya Yapısı (Önemli Dizeler)

*   `mocks/`: API endpoint'lerinizin JSON veya TS/JS handler'larını içerdiği ana klasör.
*   `templates/`: Önceden tanımlanmış mock şablonlarınızın bulunduğu klasör.
*   `public/`: Yönetim arayüzünün (UI) statik dosyalarını (HTML, CSS, JS) içerir.
*   `src/`: Tüm TypeScript kaynak kodları.

## 📝 Örnek Kullanım Senaryoları

### Mock API'lerini Test Etme

1.  **UI'yi Başlatın:**
    ```bash
    flashmock ui &
    ```
2.  **Web Tarayıcınızı Açın:** `http://localhost:3001` adresine gidin.
3.  **Bir Şablon Uygulayın:** "Templates" bölümünden "e-commerce" şablonunu seçip "Apply" butonuna tıklayın. `mocks` klasörünüz otomatik olarak e-ticaret verileriyle dolacaktır.
4.  **Mock Sunucusunu Başlatın (henüz çalıştırmadıysanız):**
    ```bash
    flashmock start &
    ```
5.  **API İstekleri Gönderin:**

    *   **Tüm Ürünleri Getir:**
        ```bash
        curl http://localhost:3000/products
        ```
    *   **Belirli Bir Ürünü Getir:**
        ```bash
        curl http://localhost:3000/products/1
        ```
    *   **Giriş İşlemi (TS Handler):**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password"}' http://localhost:3000/auth/login
        ```

### UI Üzerinden Mock Yönetimi

*   **Dosya Oluşturma:** UI'deki "+ New File" butonunu kullanarak `products/new-item/GET.json` gibi yeni bir yol girin ve içeriğini düzenleyin.
*   **Dosya Düzenleme:** Dosya ağacından herhangi bir `.json` veya `.ts` dosyasını seçerek içeriğini düzenleyin ve "Save" butonuna tıklayın. Değişiklikler anında mock sunucusuna yansıyacaktır.
*   **Dosya Silme:** Dosya ağacındaki bir dosyanın yanındaki "x" butonuna tıklayarak silme işlemini gerçekleştirin.

## 🔮 Gelecek Planları

*   Kullanıcıların kendi şablonlarını paylaştığı ve topluluk tarafından en beğenilenlerin öne çıkarıldığı bir şablon mağazası/platformu.
*   Daha gelişmiş UI özellikleri (syntax highlighting, daha iyi klasör yönetimi).
*   Gelişmiş hata ayıklama ve loglama seçenekleri.

FlashMock'u kullandığınız için teşekkür ederiz! Katkıda bulunmaktan veya geri bildirim sağlamaktan çekinmeyin.
