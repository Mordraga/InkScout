export const ALPHA_START_AT_ISO = '2026-03-30T16:00:00-04:00'
export const PUBLIC_START_AT_ISO = '2026-04-30T16:00:00-04:00'
export const ALPHA_START_AT_LABEL = 'March 30, 2026 at 4:00 PM ET'
export const PUBLIC_START_AT_LABEL = 'April 30, 2026 at 4:00 PM ET'

const ALPHA_START_AT_MS = Date.parse(ALPHA_START_AT_ISO)
const PUBLIC_START_AT_MS = Date.parse(PUBLIC_START_AT_ISO)

export function getLaunchPhase(nowMs = Date.now()) {
  if (nowMs < ALPHA_START_AT_MS) return 'prealpha'
  if (nowMs < PUBLIC_START_AT_MS) return 'alpha'
  return 'public'
}

export function getCountdownTo(targetMs, nowMs = Date.now()) {
  const diffMs = Math.max(0, targetMs - nowMs)
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

export function getAlphaStartMs() {
  return ALPHA_START_AT_MS
}

export function getPublicStartMs() {
  return PUBLIC_START_AT_MS
}
