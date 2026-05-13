const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export function fetchSchedules() {
  return request('/schedules')
}

export function fetchSchedule(id) {
  return request(`/schedules/${id}`)
}

export function createSchedule(data) {
  return request('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateSchedule(id, data) {
  return request(`/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteSchedule(id) {
  return request(`/schedules/${id}`, { method: 'DELETE' })
}

export function checkHealth() {
  return request('/health')
}
