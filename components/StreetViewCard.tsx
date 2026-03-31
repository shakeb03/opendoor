'use client'

import { useState } from 'react'

interface StreetViewCardProps {
  address: string
  submittedAddress: string
}

export default function StreetViewCard({ address, submittedAddress }: StreetViewCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const streetName = submittedAddress.split(',')[0]?.trim() || submittedAddress

  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: 20,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--ink-5)',
        margin: '0 20px 14px',
      }}
    >
      {/* Image area */}
      <div className="relative" style={{ height: 200, overflow: 'hidden' }}>
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg">
            <span style={{ fontSize: 40, opacity: 0.3 }}>🏠</span>
            {!error ? (
              <span
                className="font-sans text-ink-4"
                style={{ fontSize: 12, marginTop: 8 }}
              >
                Loading street view<span className="dots-animation" />
              </span>
            ) : (
              <span className="font-sans text-ink-4" style={{ fontSize: 12, marginTop: 8 }}>
                Street view unavailable
              </span>
            )}
          </div>
        )}
        {!error && (
          <img
            src={`/api/streetview?address=${encodeURIComponent(address)}`}
            alt={`Street view of ${address}`}
            className="w-full h-full object-cover"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between" style={{ padding: '12px 16px' }}>
        <div>
          <div className="font-serif font-semibold" style={{ fontSize: 17 }}>
            {streetName}
          </div>
          <div className="font-sans text-ink-4" style={{ fontSize: 11 }}>
            Toronto, ON · Canada
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full bg-green-light"
            style={{
              width: 6,
              height: 6,
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            className="font-sans font-semibold uppercase text-green"
            style={{ fontSize: 10, letterSpacing: '0.05em' }}
          >
            AI Active
          </span>
        </div>
      </div>
    </div>
  )
}
