export interface StoryData {
  narrative: string
  tags: string[]
  greenTags: string[]
}

export interface ComparisonSide {
  timeline: string
  netProceeds: string
  certainty: string
  showings: string
  stress: string
}

export interface ComparisonData {
  opendoor: ComparisonSide
  traditional: ComparisonSide
  verdict: string
}

export interface ScoreFactor {
  icon: string
  title: string
  detail: string
}

export interface ScoreData {
  score: number
  label: string
  summary: string
  factors: ScoreFactor[]
  estimatedOffer: string
  offerRange: string
}
