import { apiRequest } from './client'
import type { ControlPanelInput, ControlPanelRecord } from '../types/controlPanel'

export function getControlPanels(params: { name?: string; limit?: number; offset?: number }, signal?: AbortSignal) {
  const query = new URLSearchParams({
    limit: String(params.limit ?? 50),
    offset: String(params.offset ?? 0),
  })
  if (params.name?.trim()) query.set('name', params.name.trim())
  return apiRequest<ControlPanelRecord[]>(`/control_panel?${query}`, { signal })
}

export function createControlPanel(payload: ControlPanelInput) {
  return apiRequest<ControlPanelRecord>('/control_panel', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateControlPanel(id: string, payload: Partial<ControlPanelInput>) {
  return apiRequest<ControlPanelRecord>(`/control_panel/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteControlPanel(id: string) {
  return apiRequest<{ id: string }>(`/control_panel/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
