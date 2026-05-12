const API_BASE = '/api/schedules'

async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export async function fetchSchedules(params = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.page) query.set('page', params.page)
  if (params.sort) query.set('sort', params.sort)

  const qs = query.toString()
  return request(`${API_BASE}${qs ? `?${qs}` : ''}`)
}

export async function fetchSchedule(id) {
  return request(`${API_BASE}/${id}`)
}

export async function createSchedule(scheduleData) {
  return request(API_BASE, {
    method: 'POST',
    body: JSON.stringify(scheduleData),
  })
}

export async function updateSchedule(id, scheduleData) {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData),
  })
}

export async function deleteSchedule(id) {
  return request(`${API_BASE}/${id}`, { method: 'DELETE' })
}

export async function updateWorkRoom(scheduleId, roomKey, data) {
  return request(`${API_BASE}/${scheduleId}/work/${roomKey}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function duplicateSchedule(id) {
  return request(`${API_BASE}/${id}/duplicate`, { method: 'POST' })
}
