const ALPHA_TOKEN_KEY = 'inkscout-alpha-token'

function storage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getAlphaToken() {
  return storage()?.getItem(ALPHA_TOKEN_KEY) || ''
}

export function setAlphaToken(token) {
  if (!token) return
  storage()?.setItem(ALPHA_TOKEN_KEY, token)
}

export function clearAlphaToken() {
  storage()?.removeItem(ALPHA_TOKEN_KEY)
}
