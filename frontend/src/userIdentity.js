let currentUserId = null
let currentAccessToken = null

export function setApiUserIdentity(userId, accessToken = null) {
  currentUserId = userId || null
  currentAccessToken = accessToken || null
}

export function getApiUserId() {
  return currentUserId
}

export function getApiAccessToken() {
  return currentAccessToken
}
