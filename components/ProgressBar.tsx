'use client'

interface ProgressBarProps {
  step1Done: boolean
  step2Done: boolean
  step3Done: boolean
}

export default function ProgressBar({ step1Done, step2Done, step3Done }: ProgressBarProps) {
  const steps = [step1Done, step2Done, step3Done]

  return (
    <div className="flex gap-1.5" style={{ padding: '0 20px', marginBottom: 14 }}>
      {steps.map((done, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-ink-5"
          style={{ height: 3, overflow: 'hidden' }}
        >
          <div
            className="h-full rounded-full bg-green"
            style={{
              width: done ? '100%' : '0%',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      ))}
    </div>
  )
}
