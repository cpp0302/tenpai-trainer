export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          麻雀点数計算トレーニング
        </h1>
        <p className="text-gray-600 mb-8">
          実戦に近い形で点数計算を練習できるトレーニングアプリ
        </p>
        <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
          開始
        </button>
      </div>
    </main>
  );
}
