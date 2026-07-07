export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { brandName, productDescription, tone } = req.body;

    // Validasi input sederhana
    if (!brandName || !productDescription || !tone) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    // 1. Bikin prompt untuk Groq (LLM)
    const prompt = `Buatkan 1 caption media sosial (Instagram) untuk produk berikut:
Nama brand: ${brandName}
Deskripsi produk: ${productDescription}
Tone/gaya bahasa: ${tone}

Caption harus menarik, singkat (maksimal 5 kalimat), dan sertakan 3-5 hashtag relevan di akhir. Tulis dalam Bahasa Indonesia.`;

    // 2. Panggil Groq API
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", errorText);
      return res
        .status(500)
        .json({ error: "Gagal generate caption dari Groq" });
    }

    const groqData = await groqResponse.json();
    if (!groqData.choices || !groqData.choices[0]) {
      return res.status(500).json({ error: "Respons dari AI tidak valid" });
    }
    const caption = groqData.choices[0].message.content;

    // 3. Minta Groq bikin prompt gambar yang optimal (dalam Bahasa Inggris)
    const imagePromptRequest = `Product name: "${brandName}"
Product description: "${productDescription}"

Based on BOTH the product name and description above, write a short, visual image generation prompt in English (max 25 words) describing exactly how this specific dish/product should look — including its cooking method (fried, grilled, curry/stew with sauce, steamed, etc.), color, sauce/texture, and plating style. Pay close attention to the product name as it often contains the actual dish type, even if the description doesn't repeat it. Only output the prompt itself, no explanation, no quotes.`;
    const imagePromptResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: imagePromptRequest }],
        }),
      },
    );

    const imagePromptData = await imagePromptResponse.json();
    if (!imagePromptData.choices || !imagePromptData.choices[0]) {
      return res
        .status(500)
        .json({ error: "Gagal membuat prompt gambar dari AI" });
    }
    const generatedImagePrompt =
      imagePromptData.choices[0].message.content.trim();

    // 4. Bikin URL gambar dari Pollinations.ai pakai prompt yang sudah dioptimasi
    const finalImagePrompt = `${generatedImagePrompt}, professional food photography, high quality, marketing style`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalImagePrompt)}`;

    // 4. Kirim balik hasil ke frontend
    return res.status(200).json({ caption, imageUrl });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan di server" });
  }
}
