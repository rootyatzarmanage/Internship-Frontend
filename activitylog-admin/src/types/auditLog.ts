export type AuditLogRecord = {
  id: number
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  workspace_type: string | null
  workspace_id: string | null
  project_id: string | null
  ip_address: string | null
  user_agent: string | null
  status: string
  changed_from: unknown
  changed_to: unknown
  payload: unknown
  created_at: string
  // Optional joined labels; UUID fields remain the fallback when these are absent.
  user_name?: string | null
  user_email?: string | null
  resource_name?: string | null
  workspace_name?: string | null
  project_name?: string | null
}

export type AuditLogListResponse =
  | AuditLogRecord[]
  | {
      items?: AuditLogRecord[]
      results?: AuditLogRecord[]
      logs?: AuditLogRecord[]
      activity_logs?: AuditLogRecord[]
      total?: number
      total_count?: number
      total_items?: number
      count?: number
      actions?: string[]
    }

export type AuditLogQuery = {
  page: number
  pageSize: number
  search?: string
  action?: string
  startDate?: string
  endDate?: string
  workspaceId?: string
}

export type AuditLogPage = {
  items: AuditLogRecord[]
  total: number
  actions: string[]
}
