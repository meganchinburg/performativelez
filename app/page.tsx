import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-marker text-3xl sm:text-4xl text-pink-hot leading-tight">
          Bellingham
          <br />
          Performative Lesbian
          <br />
          Contest
        </h1>
        <p className="mt-3 text-sm text-purple-deep/70 font-display italic">
          Waterfront Skatepark · May 24 · 3 PM
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/judge"
          className="block w-full text-center py-5 px-6 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          🏳️‍🌈 I&apos;m a Judge
        </Link>

        <Link
          href="/results"
          className="block w-full text-center py-5 px-6 rounded-2xl text-purple-deep font-bold text-lg shadow-sm active:scale-95 transition-transform"
          style={{ borderWidth: "3px", borderColor: "#6b2fa0", borderStyle: "solid" }}
        >
          📊 View Results
        </Link>

        <Link
          href="/admin"
          className="block w-full text-center py-3 px-6 rounded-2xl text-gray-400 font-semibold text-sm active:scale-95 transition-transform"
        >
          ⚙️ Contest Setup
        </Link>
      </div>

      <p className="mt-12 text-xs text-purple-light font-display italic text-center">
        &ldquo;We walked so you could cuff your jeans.&rdquo;
      </p>
    </main>
  );
}
