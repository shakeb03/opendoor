'use client'

import { StoryData } from '@/types'

interface StoryCardProps {
  data: StoryData | null
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

export default function StoryCard({ data, isDone, isVisible }: StoryCardProps) {
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
            1
          </div>
          <div>
            <div className="font-serif font-semibold" style={{ fontSize: 16 }}>
              Your Home&apos;s Story
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
          <p
            className="font-serif italic text-ink-2"
            style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.68, marginBottom: 16 }}
          >
            {data.narrative}
          </p>
          <div style={{ borderTop: '1px solid var(--ink-5)', paddingTop: 12 }}>
            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((tag, i) => (
                <span
                  key={i}
                  className="font-sans text-ink-3"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'var(--warm)',
                    border: '1px solid var(--ink-5)',
                  }}
                >
                  {tag}
                </span>
              ))}
              {data.greenTags.map((tag, i) => (
                <span
                  key={`g-${i}`}
                  className="font-sans text-green"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'var(--green-pale)',
                    border: '1px solid var(--green-border)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
