export type ApiResponse<T> = {
  success: boolean
  message: string | null
  data: T | null
  request_id?: string | null
}

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload?.detail
        ? String(payload.detail)
        : typeof payload === 'object' && payload?.message
          ? String(payload.message)
          : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, payload)
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    'data' in payload
  ) {
    const envelope = payload as ApiResponse<T>

    if (!envelope.success) {
      throw new ApiError(envelope.message || 'API request failed', response.status, payload)
    }

    return envelope.data as T
  }

  return payload as T
}

export { API_BASE_URL }
