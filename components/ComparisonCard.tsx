'use client'

import { ComparisonData } from '@/types'

interface ComparisonCardProps {
  data: ComparisonData | null
  isDone: boolean
  isVisible: boolean
}

function Skeleton() {
  const rows = [
    { width: '100%', height: 17 },
    { width: '100%', height: 12 },
    { width: '74%', height: 12 },
    { width: '100%', height: 12 },
    { width: '48%', height: 12 },
  ]
  return (
    <div>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            width: row.width,
            height: row.height,
            borderRadius: 6,
            marginBottom: 9,
            background: 'linear-gradient(90deg, var(--ink-5) 25%, var(--warm) 50%, var(--ink-5) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.3s infinite',
          }}
        />
      ))}
    </div>
  )
}

const rowLabels = [
  { key: 'timeline' as const, label: 'Timeline' },
  { key: 'netProceeds' as const, label: 'Net Proceeds' },
  { key: 'certainty' as const, label: 'Certainty' },
  { key: 'showings' as const, label: 'Showings' },
  { key: 'stress' as const, label: 'Stress' },
]

function getTraditionalColor(key: string): string {
  if (key === 'timeline' || key === 'certainty') return 'var(--amber)'
  if (key === 'showings' || key === 'stress') return 'var(--red)'
  return 'var(--ink)'
}

export default function ComparisonCard({ data, isDone, isVisible }: ComparisonCardProps) {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: 20,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--ink-5)',
        margin: '0 20px 14px',
        padding: '18px 18px 16px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.38s ease, transform 0.38s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full bg-ink text-white font-sans font-semibold"
            style={{ width: 28, height: 28, fontSize: 12 }}
          >
            2
          </div>
          <div>
            <div className="font-serif font-semibold" style={{ fontSize: 16 }}>
              Opendoor vs Traditional
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isDone ? (
            <>
              <span className="text-green" style={{ fontSize: 13 }}>✓</span>
              <span className="font-sans font-medium text-green" style={{ fontSize: 11 }}>Done</span>
            </>
          ) : (
            <>
              <span
                className="rounded-full border-2 border-green border-t-transparent"
                style={{ width: 14, height: 14, animation: 'spin 0.6s linear infinite' }}
              />
              <span className="font-sans font-medium text-ink-3" style={{ fontSize: 11 }}>Analysing</span>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <div className="grid grid-cols-2" style={{ gap: 10, marginBottom: 14 }}>
            {/* Opendoor column */}
            <div
              style={{
                background: 'var(--green-pale)',
                border: '1.5px solid var(--green-border)',
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div
                className="font-sans font-bold uppercase text-green"
                style={{ fontSize: 9, letterSpacing: '0.1em', marginBottom: 10 }}
              >
                Opendoor
              </div>
              {rowLabels.map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div
                    className="font-sans uppercase text-ink-4"
                    style={{ fontSize: 9, letterSpacing: '0.05em', marginBottom: 2 }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-sans font-medium text-green"
                    style={{ fontSize: 13 }}
                  >
                    {data.opendoor[key]}
                  </div>
                </div>
              ))}
            </div>

            {/* Traditional column */}
            <div
              style={{
                background: 'var(--warm)',
                border: '1.5px solid var(--ink-5)',
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div
                className="font-sans font-bold uppercase text-ink-3"
                style={{ fontSize: 9, letterSpacing: '0.1em', marginBottom: 10 }}
              >
                Traditional
              </div>
              {rowLabels.map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div
                    className="font-sans uppercase text-ink-4"
                    style={{ fontSize: 9, letterSpacing: '0.05em', marginBottom: 2 }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-sans font-medium"
                    style={{ fontSize: 13, color: key === 'netProceeds' ? 'var(--ink)' : getTraditionalColor(key) }}
                  >
                    {data.traditional[key]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <div
            className="font-sans text-white"
            style={{
              background: 'var(--ink)',
              borderRadius: 12,
              padding: '13px 15px',
              fontSize: 13,
              lineHeight: 1.5,
              opacity: 0.72,
            }}
          >
            {data.verdict}
          </div>
        </>
      )}
    </div>
  )
}
