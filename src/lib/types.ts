export type TeamMember = {
  name: string
  handle: string
}

export type Project = {
  productName: string
  oneLiner: string
  description: string
  state: string
  track: string
  bannerUrl: string
  logoUrl: string
  twitter?: string
  website?: string
  telegram?: string
  documentation?: string
  wallet?: string
  community?: string
  team: TeamMember[]
}
