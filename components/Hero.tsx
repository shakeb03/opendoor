export default function Hero() {
  return (
    <div style={{ padding: '32px 20px 28px' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
        <span
          className="bg-green"
          style={{ width: 18, height: 2, display: 'inline-block', borderRadius: 1 }}
        />
        <span
          className="font-sans font-semibold uppercase text-green"
          style={{ fontSize: 10, letterSpacing: '0.2em' }}
        >
          AI Home Intelligence
        </span>
      </div>
      <h1
        className="font-serif"
        style={{ fontSize: 44, fontWeight: 300, lineHeight: 0.97, letterSpacing: '-0.03em', marginBottom: 14 }}
      >
        Your Home,<br />
        <strong className="font-bold italic text-green">Understood.</strong>
      </h1>
      <p
        className="font-sans text-ink-3"
        style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.6 }}
      >
        Enter any Toronto address and let AI reveal your home&apos;s story,
        compare selling options, and estimate your offer — in seconds.
      </p>
    </div>
  )
}
