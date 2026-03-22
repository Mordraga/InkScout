export const ALPHA_UNLOCK_AT_ISO = '2026-03-30T16:00:00-04:00'
export const ALPHA_UNLOCK_AT_LABEL = 'March 30, 2026 at 4:00 PM ET'

const ALPHA_UNLOCK_AT_MS = Date.parse(ALPHA_UNLOCK_AT_ISO)

export function isLaunchLocked(nowMs = Date.now()) {
  return nowMs < ALPHA_UNLOCK_AT_MS
}

export function getCountdown(nowMs = Date.now()) {
  const diffMs = Math.max(0, ALPHA_UNLOCK_AT_MS - nowMs)
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}
