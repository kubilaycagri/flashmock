# FlashMock: Hızlı ve Esnek API Mock Sunucusu / Fast & Flexible API Mock Server

![FlashMock Logo](https://img.shields.io/badge/FlashMock-API_Mocking-blueviolet?style=for-the-badge&logo=react)
![Hono](https://img.shields.io/badge/Hono-fast_web_framework-blue?style=for-the-badge&logo=hono)
![TypeScript](https://img.shields.io/badge/TypeScript-Strongly_Typed-blue?style=for-the-badge&logo=typescript)
![Chokidar](https://img.shields.io/badge/Chokidar-File_Watching-green?style=for-the-badge&logo=chokidar)
![Cac](https://img.shields.io/badge/CAC-CLI_Framework-orange?style=for-the-badge)

---

## Türkçe Açıklama

FlashMock, geliştiricilerin yerel ortamda hızla ve kolayca API mock'ları oluşturmasını sağlayan açık kaynaklı bir CLI aracıdır. Karmaşık sunucu kurulumlarına gerek kalmadan, sadece bir klasöre JSON veya TypeScript dosyaları yerleştirerek anında bir REST API simülasyonu başlatın. Ayrıca, mock'larınızı web arayüzü üzerinden yönetmenizi ve hazır şablonlarla hızla başlamanızı sağlayan güçlü bir UI ile birlikte gelir.

## English Description

FlashMock is an open-source CLI tool that enables developers to quickly and easily create API mocks in their local environment. Without the need for complex server setups, you can instantly launch a REST API simulation by simply placing JSON or TypeScript files in a folder. It also comes with a powerful UI that allows you to manage your mocks via a web interface and quickly get started with pre-built templates.

---

## ✨ Özellikler / Features

*   **Dosya Tabanlı Yönlendirme / File-Based Routing:** `./mocks` klasörünüzdeki dosya yapısı, API endpoint'lerini otomatik olarak oluşturur. / The file structure in your `./mocks` folder automatically creates API endpoints.
    *   `mocks/users/GET.json` -> `GET /users`
    *   `mocks/products/POST.json` -> `POST /products`
    *   `mocks/users/[id]/GET.json` -> `GET /users/:id` (Dinamik route desteği / Dynamic route support)
*   **Dinamik JS/TS Handler Desteği / Dynamic JS/TS Handler Support:** Sadece JSON değil, TypeScript/JavaScript dosyalarıyla (örneğin `mocks/auth/login/POST.ts`) dinamik yanıtlar döndüren Hono handler'ları oluşturabilirsiniz. / You can create Hono handlers that return dynamic responses using TypeScript/JavaScript files (e.g., `mocks/auth/login/POST.ts`), not just JSON.
*   **Sıcak Yeniden Yükleme (Hot Reload):** `mocks` klasöründe yapılan değişiklikler (dosya ekleme, silme, düzenleme) sunucuyu otomatik olarak günceller, yeniden başlatmaya gerek kalmaz. / Changes made in the `mocks` folder (adding, deleting, editing files) automatically update the server without needing a restart.
*   **CORS Desteği / CORS Support:** Geliştirme kolaylığı için tüm API isteklerine varsayılan olarak izin verilir. / All API requests are allowed by default for ease of development.
*   **Web Tabanlı Yönetim Arayüzü (UI) / Web-Based Management Interface (UI):** Mock dosyalarınızı görsel bir arayüz üzerinden CRUD (Create, Read, Update, Delete) işlemleriyle yönetin. / Manage your mock files with CRUD (Create, Read, Update, Delete) operations via a visual interface.
*   **Hazır Şablonlar / Pre-built Templates:** E-ticaret, okul yönetimi gibi senaryolara özel önceden hazırlanmış şablonları UI üzerinden tek tıkla uygulayarak hızla mock verileri oluşturun. / Quickly generate mock data by applying pre-built templates tailored for scenarios like e-commerce or school management with a single click via the UI.

---

## 🚀 Teknoloji Yığını / Tech Stack

*   **Dil / Language:** TypeScript (Node.js)
*   **Web Sunucusu / Web Server:** Hono (Hafif ve hızlı / Lightweight and fast)
*   **CLI Framework:** Cac
*   **Dosya İzleme / File Watching:** Chokidar
*   **Renkli Loglar / Colored Logs:** Picocolors
*   **Dosya İşlemleri / File Operations:** `fs-extra`

---

## 📦 Kurulum / Installation

1.  **Projeyi Klonlayın / Clone the Project:**
    ```bash
    git clone https://github.com/your-username/flashmock.git
    cd flashmock
    ```
    (Henüz GitHub'da değilse bu adımı atlayın / Skip this step if not yet on GitHub)

2.  **Bağımlılıkları Yükleyin / Install Dependencies:**
    ```bash
    npm install
    ```

3.  **CLI Komutunu Global Yapın (Önerilir) / Make CLI Command Global (Recommended):**
    `flashmock` komutunu sisteminizin herhangi bir yerinden kullanabilmek için: / To use the `flashmock` command from anywhere on your system:
    ```bash
    npm link
    ```

---

## 💡 Kullanım / Usage

FlashMock iki ana komut sunar: mock sunucusu için `start` ve yönetim arayüzü için `ui`. / FlashMock offers two main commands: `start` for the mock server and `ui` for the management interface.

### 1. Mock Sunucusunu Başlatma / Starting the Mock Server

```bash
flashmock start [options]
```

**Seçenekler / Options:**

*   `--port <port>`: Sunucunun dinleyeceği portu belirtir (Varsayılan: `3000`). / Specifies the port the server will listen on (Default: `3000`).

**Örnek / Example:**
```bash
flashmock start --port 8080
```

Mock sunucusu başladıktan sonra, `http://localhost:3000` (veya belirttiğiniz port) üzerinden mock API'lerinize erişebilirsiniz. / Once the mock server starts, you can access your mock APIs via `http://localhost:3000` (or your specified port).

### 2. Yönetim Arayüzünü (UI) Başlatma / Starting the Management Interface (UI)

```bash
flashmock ui [options]
```

**Seçenekler / Options:**

*   `--port <port>`: UI sunucusunun dinleyeceği portu belirtir (Varsayılan: `3001`). / Specifies the port the UI server will listen on (Default: `3001`).

**Örnek / Example:**
```bash
flashmock ui --port 8081
```

UI sunucusu başladıktan sonra, `http://localhost:3001` (veya belirttiğiniz port) üzerinden web arayüzüne erişebilirsiniz. / Once the UI server starts, you can access the web interface via `http://localhost:3001` (or your specified port).

---

## 📂 Dosya Yapısı (Önemli Dizeler) / File Structure (Key Directories)

*   `mocks/`: API endpoint'lerinizin JSON veya TS/JS handler'larını içerdiği ana klasör. / The main folder containing your API endpoints' JSON or TS/JS handlers.
*   `templates/`: Önceden tanımlanmış mock şablonlarınızın bulunduğu klasör. / The folder where your predefined mock templates are located.
*   `public/`: Yönetim arayüzünün (UI) statik dosyalarını (HTML, CSS, JS) içerir. / Contains the static files (HTML, CSS, JS) for the management interface (UI).
*   `src/`: Tüm TypeScript kaynak kodları. / All TypeScript source codes.

---

## 📝 Örnek Kullanım Senaryoları / Example Usage Scenarios

### Mock API'lerini Test Etme / Testing Mock APIs

1.  **UI'yi Başlatın / Start the UI:**
    ```bash
    flashmock ui &
    ```
2.  **Web Tarayıcınızı Açın / Open Your Web Browser:** `http://localhost:3001` adresine gidin.
3.  **Bir Şablon Uygulayın / Apply a Template:** "Templates" bölümünden "e-commerce" şablonunu seçip "Apply" butonuna tıklayın. `mocks` klasörünüz otomatik olarak e-ticaret verileriyle dolacaktır. / In the "Templates" section, select the "e-commerce" template and click "Apply". Your `mocks` folder will automatically be populated with e-commerce data.
4.  **Mock Sunucusunu Başlatın (henüz çalıştırmadıysanız) / Start the Mock Server (if not already running):**
    ```bash
    flashmock start &
    ```
5.  **API İstekleri Gönderin / Send API Requests:**

    *   **Tüm Ürünleri Getir / Get All Products:**
        ```bash
        curl http://localhost:3000/products
        ```
    *   **Belirli Bir Ürünü Getir / Get a Specific Product:**
        ```bash
        curl http://localhost:3000/products/1
        ```
    *   **Giriş İşlemi (TS Handler) / Login Operation (TS Handler):**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password"}' http://localhost:3000/auth/login
        ```

### UI Üzerinden Mock Yönetimi / Managing Mocks via UI

*   **Dosya Oluşturma / Create File:** UI'deki "+ New File" butonunu kullanarak `products/new-item/GET.json` gibi yeni bir yol girin ve içeriğini düzenleyin. / Use the "+ New File" button in the UI to enter a new path like `products/new-item/GET.json` and edit its content.
*   **Dosya Düzenleme / Edit File:** Dosya ağacından herhangi bir `.json` veya `.ts` dosyasını seçerek içeriğini düzenleyin ve "Save" butonuna tıklayın. Değişiklikler anında mock sunucusuna yansıyacaktır. / Select any `.json` or `.ts` file from the file tree, edit its content, and click "Save". Changes will instantly reflect in the mock server.
*   **Dosya Silme / Delete File:** Dosya ağacındaki bir dosyanın yanındaki "x" butonuna tıklayarak silme işlemini gerçekleştirin. / Perform a delete operation by clicking the "x" button next to a file in the file tree.

---

## 🔮 Gelecek Planları / Future Plans

*   Kullanıcıların kendi şablonlarını paylaştığı ve topluluk tarafından en beğenilenlerin öne çıkarıldığı bir şablon mağazası/platformu. / A template store/platform where users can share their own templates and the most popular ones are highlighted.
*   Daha gelişmiş UI özellikleri (syntax highlighting, daha iyi klasör yönetimi). / More advanced UI features (syntax highlighting, better folder management).
*   Gelişmiş hata ayıklama ve loglama seçenekleri. / Advanced debugging and logging options.

FlashMock'u kullandığınız için teşekkür ederiz! Katkıda bulunmaktan veya geri bildirim sağlamaktan çekinmeyin. / Thank you for using FlashMock! Feel free to contribute or provide feedback.