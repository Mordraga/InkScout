export const PLAN_DEFS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    blurb: 'Bluesky scouting and manual runs for solo testing.',
    cta: 'Start Free',
    features: [
      'Bluesky source enabled',
      'Manual search only',
      'Core lead triage workspace',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    monthly: 29,
    blurb: 'Unlock Twitter and turn on automatic scanning.',
    cta: 'Choose Basic',
    features: [
      'Twitter API unlocked',
      'Auto search every 30 min',
      'Up to 5 stored posts per run',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    monthly: 79,
    blurb: 'Faster throughput and MootsKeeper integration.',
    cta: 'Choose Standard',
    features: [
      'Everything in Basic',
      'Up to 10 stored posts per run',
      'MootsKeeper integration',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 199,
    blurb: 'Highest cadence and priority support.',
    cta: 'Choose Pro',
    features: [
      'Everything in Standard',
      'Auto search every 15 min',
      'Priority support',
    ],
  },
]

export function yearlyPrice(monthly) {
  if (!monthly) return 0
  return Math.round(monthly * 12 * 0.8)
}
