export default function TopBar() {
  return (
    <div
      className="sticky top-0 z-[100] bg-bg"
      style={{
        padding: '54px 20px 20px',
        borderBottom: '1px solid var(--ink-5)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full bg-green-light"
            style={{ width: 9, height: 9, display: 'inline-block' }}
          />
          <span className="font-serif font-bold" style={{ fontSize: 22 }}>
            opendoor
          </span>
        </div>
        <span
          className="font-sans font-semibold uppercase text-green"
          style={{
            fontSize: 10,
            letterSpacing: '0.1em',
            padding: '5px 10px',
            borderRadius: 20,
            background: 'var(--green-pale)',
            border: '1px solid var(--green-border)',
          }}
        >
          Toronto 2026
        </span>
      </div>
    </div>
  )
}
