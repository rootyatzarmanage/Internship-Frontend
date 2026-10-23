import { apiRequest } from "./client";
import type {
  AuditLogListResponse,
  AuditLogPage,
  AuditLogQuery,
} from "../types/auditLog";

const AUDIT_LOGS_ENDPOINT =
  import.meta.env.VITE_AUDIT_LOGS_ENDPOINT || "/audit-demo/activity-logs";

function buildQuery(params: AuditLogQuery) {
  const limit = Math.max(1, params.pageSize);
  const offset = Math.max(0, (params.page - 1) * limit);
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (params.workspaceId) query.set("workspace_id", params.workspaceId);
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.action) query.set("action", params.action);
  if (params.startDate) query.set("start_date", params.startDate);
  if (params.endDate) query.set("end_date", params.endDate);

  return query.toString();
}

export async function getAuditLogs(
  params: AuditLogQuery,
  signal?: AbortSignal,
): Promise<AuditLogPage> {
  const response = await apiRequest<AuditLogListResponse>(
    `${AUDIT_LOGS_ENDPOINT}?${buildQuery(params)}`,
    { signal },
  );

  if (!response) return { items: [], total: 0, actions: [] };

  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      actions: [...new Set(response.map((entry) => entry.action))],
    };
  }

  const items =
    response.items ??
    response.results ??
    response.logs ??
    response.activity_logs ??
    [];
  return {
    items,
    total:
      response.total ??
      response.total_count ??
      response.total_items ??
      response.count ??
      items.length,
    actions: response.actions ?? [
      ...new Set(items.map((entry) => entry.action)),
    ],
  };
}
