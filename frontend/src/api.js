/**
 * InkScout API client.
 */

import { getApiAccessToken } from './userIdentity.js'

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://web-production-656fd.up.railway.app').replace(/\/$/, '')

async function request(method, path, body = null, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const accessToken = getApiAccessToken()
    const headers = { 'Content-Type': 'application/json' }
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`
      try {
        const responseBody = await res.json()
        detail = responseBody.detail || JSON.stringify(responseBody) || detail
      } catch {
        // Non-JSON response body.
      }
      throw new Error(detail)
    }

    if (res.status === 204) return null
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

// Profiles
export async function getProfiles() {
  return request('GET', '/profiles')
}
export async function createProfile(name, color, active = true) {
  return request('POST', '/profiles', { name, color, active })
}
export async function updateProfile(id, patch) {
  return request('PATCH', `/profiles/${id}`, patch)
}
export async function deleteProfile(id) {
  return request('DELETE', `/profiles/${id}`)
}

// Keywords pool
export async function getKeywords() {
  return request('GET', '/keywords')
}
export async function addKeyword(text) {
  return request('POST', '/keywords', { text })
}
export async function addKeywordsBulk(texts) {
  return request('POST', '/keywords/bulk', { texts })
}
export async function deleteKeyword(id) {
  return request('DELETE', `/keywords/${id}`)
}

// Profile keywords
export async function getProfileKeywords(profileId) {
  return request('GET', `/profiles/${profileId}/keywords`)
}
export async function associateKeyword(profileId, text) {
  return request('POST', `/profiles/${profileId}/keywords`, { text })
}
export async function associateKeywordById(profileId, keywordId) {
  return request('POST', `/profiles/${profileId}/keywords`, { keyword_id: keywordId })
}
export async function associateKeywordsBulk(profileId, texts) {
  return request('POST', `/profiles/${profileId}/keywords/bulk`, { texts })
}
export async function disassociateKeyword(profileId, keywordId) {
  return request('DELETE', `/profiles/${profileId}/keywords/${keywordId}`)
}
export async function toggleProfileKeyword(profileId, keywordId, active) {
  return request('PATCH', `/profiles/${profileId}/keywords/${keywordId}`, { active })
}

// Leads
export async function getLeads({ status, maxAgeHours, keyword } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (maxAgeHours > 0) params.set('max_age_hours', maxAgeHours)
  if (keyword) params.set('keyword', keyword)
  const qs = params.toString() ? `?${params}` : ''
  const data = await request('GET', `/leads${qs}`)
  return data.leads
}
export async function patchLeadStatus(id, status) {
  return request('PATCH', `/leads/${id}/status`, { status })
}
export async function clearAllLeads() {
  const data = await request('DELETE', '/leads')
  return data?.deleted ?? 0
}

// Blacklist
export async function getBlacklist() {
  return request('GET', '/blacklist')
}
export async function addBlacklist(platform, blockedHandle, reason = null) {
  return request('POST', '/blacklist', { platform, blocked_handle: blockedHandle, reason })
}
export async function deleteBlacklist(id) {
  return request('DELETE', `/blacklist/${id}`)
}

// Synonyms
export async function getSynonyms() {
  return request('GET', '/synonyms')
}
export async function addSynonym(trigger, terms) {
  return request('POST', '/synonyms', { trigger, terms })
}
export async function updateSynonym(id, patch) {
  return request('PATCH', `/synonyms/${id}`, patch)
}
export async function deleteSynonym(id) {
  return request('DELETE', `/synonyms/${id}`)
}

// Settings
export async function getSettings() {
  return request('GET', '/settings')
}
export async function updateSettings(payload) {
  return request('PUT', '/settings', payload)
}

// Search
export async function runSearch() {
  return request('POST', '/search/run', {}, 60000)
}

// Logs
export async function getLogs(limit = 100) {
  const data = await request('GET', `/logs/recent?limit=${limit}`)
  return data?.lines ?? []
}

// Billing
export async function getEntitlements() {
  return request('GET', '/billing/entitlements')
}
export async function createCheckoutSession(payload) {
  return request('POST', '/billing/checkout-session', payload)
}

// Alpha access
export async function getAlphaStatus() {
  return request('GET', '/alpha/status')
}
export async function redeemAlphaKey(key) {
  return request('POST', '/alpha/redeem', { key })
}

// Health / version
export async function checkHealth() {
  try {
    await request('GET', '/health')
    return true
  } catch {
    return false
  }
}
export async function getVersion() {
  return request('GET', '/version')
}

export async function getPublicStats() {
  return request('GET', '/public/stats')
}
