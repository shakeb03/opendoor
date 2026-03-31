'use client'

import { useState, useCallback, useRef } from 'react'
import TopBar from '@/components/TopBar'
import Hero from '@/components/Hero'
import SearchBox from '@/components/SearchBox'
import StreetViewCard from '@/components/StreetViewCard'
import ProgressBar from '@/components/ProgressBar'
import StoryCard from '@/components/StoryCard'
import ComparisonCard from '@/components/ComparisonCard'
import ScoreCard from '@/components/ScoreCard'
import { StoryData, ComparisonData, ScoreData } from '@/types'

const sampleAddresses = [
  '120 Adelaide St W, Toronto',
  '55 Bloor St W, Toronto',
  '300 Front St W, Toronto',
  '19 Duncan St, Toronto',
  '1 Yonge St, Toronto',
]

export default function Home() {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [submittedAddress, setSubmittedAddress] = useState('')
  const [storyData, setStoryData] = useState<StoryData | null>(null)
  const [storyDone, setStoryDone] = useState(false)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [comparisonDone, setComparisonDone] = useState(false)
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [scoreDone, setScoreDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [card1Visible, setCard1Visible] = useState(false)
  const [card2Visible, setCard2Visible] = useState(false)
  const [card3Visible, setCard3Visible] = useState(false)

  const addressRef = useRef(address)
  addressRef.current = address

  const handleAnalyse = useCallback(() => {
    const currentAddress = addressRef.current
    if (!currentAddress.trim()) return

    // Reset state
    setIsLoading(true)
    setShowResults(true)
    setSubmittedAddress(currentAddress)
    setStoryData(null)
    setStoryDone(false)
    setComparisonData(null)
    setComparisonDone(false)
    setScoreData(null)
    setScoreDone(false)
    setError(null)
    setCard1Visible(false)
    setCard2Visible(false)
    setCard3Visible(false)

    // Stagger card appearance
    setTimeout(() => setCard1Visible(true), 60)
    setTimeout(() => setCard2Visible(true), 160)
    setTimeout(() => setCard3Visible(true), 260)

    // Auto-scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 350)

    // Parallel API calls
    const fetchStory = async () => {
      try {
        const res = await fetch('/api/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: currentAddress }),
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setStoryData(data)
      } catch {
        setStoryData(null)
      } finally {
        setStoryDone(true)
      }
    }

    const fetchComparison = async () => {
      try {
        const res = await fetch('/api/comparison', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: currentAddress }),
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setComparisonData(data)
      } catch {
        setComparisonData(null)
      } finally {
        setComparisonDone(true)
      }
    }

    const fetchScore = async () => {
      try {
        const res = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: currentAddress }),
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setScoreData(data)
      } catch {
        setScoreData(null)
      } finally {
        setScoreDone(true)
      }
    }

    Promise.all([fetchStory(), fetchComparison(), fetchScore()])
      .catch(() => setError('All analyses failed. Please try again.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="mx-auto" style={{ maxWidth: 430 }}>
      <TopBar />
      <Hero />
      <SearchBox
        value={address}
        onChange={setAddress}
        onSubmit={handleAnalyse}
        isLoading={isLoading}
        sampleAddresses={sampleAddresses}
      />

      {showResults && (
        <div id="results">
          <StreetViewCard address={submittedAddress} submittedAddress={submittedAddress} />
          <ProgressBar step1Done={storyDone} step2Done={comparisonDone} step3Done={scoreDone} />
          <StoryCard data={storyData} isDone={storyDone} isVisible={card1Visible} />
          <ComparisonCard data={comparisonData} isDone={comparisonDone} isVisible={card2Visible} />
          <ScoreCard data={scoreData} isDone={scoreDone} isVisible={card3Visible} />

          {error && storyDone && comparisonDone && scoreDone && !storyData && !comparisonData && !scoreData && (
            <div
              className="font-sans text-center"
              style={{
                color: 'var(--red)',
                fontSize: 13,
                padding: '12px 20px',
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="font-sans text-center text-ink-4"
        style={{ fontSize: 11, padding: '24px 20px 40px' }}
      >
        Built by <span className="text-green">Shakeb</span> · Opendoor Toronto Demo
      </div>
    </div>
  )
}
