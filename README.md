# AI Social Media Content Generator

Web app yang generate caption dan gambar promosi untuk produk, menggunakan LLM dan image generation model.

**Live demo:** https://ai-social-media-content-generator-drab.vercel.app  
**Repo:** https://github.com/riphany/ai-social-media-content-generator

## Cara Kerja

User input nama produk, deskripsi, dan tone (santai/profesional/lucu/mewah). Sistem lalu:

1. Kirim data ke Groq API (LLM) untuk generate caption sosial media
2. Kirim data yang sama ke Groq API lagi untuk generate prompt gambar yang optimal dalam Bahasa Inggris (LLM ini yang menerjemahkan konteks produk jadi kata kunci visual)
3. Prompt hasil dari step 2 dipakai untuk generate gambar lewat Pollinations.ai
4. Caption dan gambar ditampilkan ke user

Kenapa ada 2 kali panggilan LLM: percobaan awal langsung pakai deskripsi produk mentah sebagai prompt gambar, hasilnya sering tidak sesuai konteks (misal deskripsi tidak menyebut metode masak, tapi nama produk menyebutnya). Jadi step generate prompt gambar sekarang menerima nama produk + deskripsi sekaligus, supaya sistem tetap akurat meski user tidak menulis deskripsi lengkap.

## Tech Stack

- **Next.js** (Pages Router) - frontend + API routes dalam satu project
- **React** - state management dengan useState
- **Tailwind CSS** - styling
- **Groq API** - LLM (model: llama-3.3-70b-versatile), dipakai untuk caption dan prompt gambar
- **Pollinations.ai** - image generation, tidak butuh API key, cukup request URL dengan prompt
- **Vercel** - deployment

## Struktur Project

```
pages/
├── index.js          # UI: form input dan tampilan hasil
├── api/
│   └── generate.js   # Backend: panggil Groq API dan Pollinations.ai
```

Logic AI (API key, prompt, fetch ke Groq/Pollinations) semua ada di `pages/api/generate.js`, tidak pernah jalan di browser. Ini penting karena API key harus tetap di server, tidak boleh terekspos ke client.

## Menjalankan di Local

```bash
git clone https://github.com/riphany/ai-social-media-content-generator.git
cd ai-social-media-content-generator
npm install
```

Buat file `.env.local` di root project:

```
GROQ_API_KEY=your_groq_api_key_here
```

API key bisa didapat gratis di [console.groq.com](https://console.groq.com).

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

| Key            | Keterangan                                      |
| -------------- | ----------------------------------------------- |
| `GROQ_API_KEY` | API key dari Groq, dipakai untuk request ke LLM |

## Catatan

- Tidak ada database. Setiap generate independen, tidak disimpan.
- Pollinations.ai tidak menjamin konsistensi hasil gambar 100% akurat untuk deskripsi yang sangat spesifik/lokal (misal masakan daerah tertentu), karena keterbatasan data training model.
- Error handling di `generate.js` mengecek response Groq API sebelum diproses lebih lanjut, supaya error dari API pihak ketiga tidak membuat aplikasi crash.

## Author

Muhammad Riphany
GitHub: [@riphany](https://github.com/riphany)
