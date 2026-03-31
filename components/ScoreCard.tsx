'use client'

import { useEffect, useState } from 'react'
import { ScoreData } from '@/types'

interface ScoreCardProps {
  data: ScoreData | null
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

function ScoreRing({ score }: { score: number }) {
  const [animatedOffset, setAnimatedOffset] = useState(219.9)
  const circumference = 219.9
  const targetOffset = circumference - (score / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(targetOffset)
    }, 80)
    return () => clearTimeout(timer)
  }, [targetOffset])

  const color = score >= 75 ? 'var(--green)' : score >= 55 ? 'var(--amber)' : 'var(--red)'

  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <circle
        cx="42"
        cy="42"
        r="35"
        fill="none"
        stroke="var(--ink-5)"
        strokeWidth="5"
      />
      <circle
        cx="42"
        cy="42"
        r="35"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={animatedOffset}
        strokeLinecap="round"
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <text
        x="42"
        y="42"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-serif"
        style={{ fontSize: 24, fontWeight: 700, fill: 'var(--ink)' }}
      >
        {score}
      </text>
    </svg>
  )
}

export default function ScoreCard({ data, isDone, isVisible }: ScoreCardProps) {
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
            3
          </div>
          <div>
            <div className="font-serif font-semibold" style={{ fontSize: 16 }}>
              Seller Score
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
          {/* Score ring + metadata */}
          <div className="flex items-center gap-4" style={{ marginBottom: 16 }}>
            <ScoreRing score={data.score} />
            <div>
              <div className="font-serif font-bold" style={{ fontSize: 20 }}>
                {data.label}
              </div>
              <div className="font-sans text-ink-3" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>
                {data.summary}
              </div>
            </div>
          </div>

          {/* Factors */}
          <div className="flex flex-col gap-2" style={{ marginBottom: 14 }}>
            {data.factors.map((factor, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
                style={{
                  background: 'var(--bg)',
                  borderRadius: 12,
                  padding: '10px 12px',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{factor.icon}</span>
                <div>
                  <div className="font-sans font-semibold" style={{ fontSize: 13 }}>
                    {factor.title}
                  </div>
                  <div className="font-sans text-ink-3" style={{ fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>
                    {factor.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Net estimate */}
          <div
            className="flex items-center justify-between"
            style={{
              background: 'var(--ink)',
              borderRadius: 14,
              padding: '14px 16px',
            }}
          >
            <div>
              <div
                className="font-sans uppercase"
                style={{ fontSize: 9, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}
              >
                Estimated Offer
              </div>
              <div className="font-serif font-bold text-white" style={{ fontSize: 28 }}>
                {data.estimatedOffer}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                {data.offerRange}
              </div>
            </div>
            <button
              className="font-sans font-semibold text-white bg-green"
              style={{
                fontSize: 13,
                padding: '10px 18px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Get Offer →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
