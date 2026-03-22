let currentUserId = null

export function setApiUserId(userId) {
  currentUserId = userId || null
}

export function getApiUserId() {
  return currentUserId
}
