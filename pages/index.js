import { useState } from "react";

export default function Home() {
  const [brandName, setBrandName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tone, setTone] = useState("santai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, productDescription, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI Social Media Content Generator{" "}
        </h1>{" "}
        <p className="text-gray-500 mb-8">
          Buat caption dan gambar promosi otomatis untuk produkmu.{" "}
        </p>{" "}
        {/* Form Input */}{" "}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Brand / Produk{" "}
            </label>{" "}
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Misal: Kopi Senja"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Produk{" "}
            </label>{" "}
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Misal: Kopi susu kekinian dengan gula aren asli"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone / Gaya Bahasa{" "}
            </label>{" "}
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="santai"> Santai </option>{" "}
              <option value="profesional"> Profesional </option>{" "}
              <option value="lucu"> Lucu </option>{" "}
              <option value="mewah"> Mewah / Elegan </option>{" "}
            </select>{" "}
          </div>{" "}
          <button
            onClick={handleGenerate}
            disabled={loading || !brandName || !productDescription}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sedang membuat konten..." : "Generate Konten"}{" "}
          </button>{" "}
        </div>{" "}
        {/* Error Message */}{" "}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
        {/* Hasil */}{" "}
        {result && (
          <div className="mt-6 bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800"> Hasil </h2>{" "}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {" "}
                Caption:{" "}
              </p>{" "}
              <p className="whitespace-pre-line text-gray-800 bg-gray-50 p-3 rounded-lg">
                {" "}
                {result.caption}{" "}
              </p>{" "}
            </div>{" "}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {" "}
                Gambar:{" "}
              </p>{" "}
              <img
                src={result.imageUrl}
                alt="Generated content"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
