'use client'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  sampleAddresses: string[]
}

export default function SearchBox({ value, onChange, onSubmit, isLoading, sampleAddresses }: SearchBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleChipClick = (address: string) => {
    onChange(address)
    // Use setTimeout to ensure state is updated before submit
    setTimeout(() => onSubmit(), 0)
  }

  return (
    <div style={{ padding: '0 20px 20px' }}>
      {/* Search field */}
      <div
        className="search-field flex items-center bg-white"
        style={{
          border: '1.5px solid var(--ink-5)',
          borderRadius: 16,
          boxShadow: 'var(--card-shadow)',
          paddingLeft: 16,
        }}
      >
        {/* Location icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink-4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8z" />
        </svg>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter any Toronto address"
          className="font-sans flex-1 bg-transparent outline-none"
          style={{ fontSize: 16, padding: '16px 12px' }}
        />

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center justify-center bg-green text-white flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: 'none',
            margin: 5,
            cursor: isLoading ? 'default' : 'pointer',
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => {
            if (!isLoading) (e.currentTarget.style.transform = 'scale(0.93)')
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {isLoading ? (
            <span
              className="rounded-full border-2 border-white border-t-transparent"
              style={{ width: 18, height: 18, display: 'block', animation: 'spin 0.6s linear infinite' }}
            />
          ) : (
            <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
          )}
        </button>
      </div>

      {/* Chips row */}
      <div
        className="flex gap-2"
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          marginTop: 12,
          paddingBottom: 2,
        }}
      >
        {sampleAddresses.map((addr) => (
          <button
            key={addr}
            onClick={() => handleChipClick(addr)}
            className="font-sans text-ink-3 whitespace-nowrap flex-shrink-0"
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '7px 14px',
              borderRadius: 20,
              background: 'var(--white)',
              border: '1px solid var(--ink-5)',
              cursor: 'pointer',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.96)'
              e.currentTarget.style.background = 'var(--green-pale)'
              e.currentTarget.style.borderColor = 'var(--green-border)'
              e.currentTarget.style.color = 'var(--green)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.background = 'var(--white)'
              e.currentTarget.style.borderColor = 'var(--ink-5)'
              e.currentTarget.style.color = 'var(--ink-3)'
            }}
          >
            {addr}
          </button>
        ))}
      </div>

      <style jsx>{`
        .search-field:focus-within {
          border-color: var(--green);
          box-shadow: var(--card-shadow), 0 0 0 3px var(--green-pale);
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
