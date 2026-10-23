import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Ellipsis,
  Filter,
  ListFilter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getAuditLogs } from "../../api/auditLogApi";
import type { AuditLogRecord } from "../../types/auditLog";

const pageSize = 10;

function label(value?: string | null) {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function shortId(value?: string | null) {
  if (!value) return null;
  return value.length > 14 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
}

function dateParameters(range: string) {
  const days =
    range === "Today"
      ? 0
      : range === "Last 7 days"
        ? 7
        : range === "Last 30 days"
          ? 30
          : null;
  if (days === null) return { startDate: undefined, endDate: undefined };

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - days);
  const toIsoDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
}

function matchesDateRange(value: string, range: string) {
  const date = new Date(value);
  if (range === "All time") return true;
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (range === "Last 7 days") start.setDate(start.getDate() - 6);
  if (range === "Last 30 days") start.setDate(start.getDate() - 29);

  return date >= start && date <= today;
}

function displayUser(entry: AuditLogRecord) {
  return (
    entry.user_name ||
    entry.user_email ||
    (entry.user_id ? `User ${shortId(entry.user_id)}` : "System")
  );
}

function displayResource(entry: AuditLogRecord) {
  return entry.resource_name || shortId(entry.resource_id) || "—";
}

function displayWorkspace(entry: AuditLogRecord) {
  return (
    entry.workspace_name ||
    shortId(entry.workspace_id) ||
    label(entry.workspace_type)
  );
}

function displayProject(entry: AuditLogRecord) {
  return entry.project_name || shortId(entry.project_id) || "No project";
}

function formatDate(value: string, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(
    "en-IN",
    withTime
      ? { dateStyle: "medium", timeStyle: "short" }
      : { dateStyle: "medium" },
  ).format(date);
}

export function ActivityLog() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("");
  const [range, setRange] = useState("Last 30 days");
  const [selected, setSelected] = useState<AuditLogRecord | null>(null);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AuditLogRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getAuditLogs(
      {
        page,
        pageSize,
        search: query,
        action: action || undefined,
        ...dateParameters(range),
      },
      controller.signal,
    )
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
        setActions(result.actions);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [page, pageSize, query, action, range, refreshKey]);

  const visibleItems = error
    ? items.filter((entry) => {
        const matchesSearch = JSON.stringify(entry)
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesAction = !action || entry.action === action;
        return (
          matchesSearch &&
          matchesAction &&
          matchesDateRange(entry.created_at, range)
        );
      })
    : items;
  const visibleTotal = error ? visibleItems.length : total;
  const pageCount = Math.max(1, Math.ceil(visibleTotal / pageSize));

  return (
    <div className="activity-log-page w-full [&_.eyebrow]:!text-[11px] [&_.page-heading_h1]:!text-[28px] [&_.page-heading_p]:!text-[14px] [&_.export-button]:!text-[13px] [&_.panel-heading_h2]:!text-[16px] [&_.panel-heading_p]:!text-[12px] [&_.filter-toggle]:!text-[12px] [&_.filter-count]:!text-[11px] [&_.search-field_input]:!text-[12px] [&_.search-field_kbd]:!text-[10px] [&_.select-wrap_select]:!text-[12px] [&_.table-wrap_th]:!text-[10px] [&_.table-wrap_td]:!text-[12px] [&_.date-cell>span]:!text-[12px] [&_.date-cell>small]:!text-[11px] [&_.table-user_strong]:!text-[12px] [&_.table-user_small]:!text-[11px] [&_.table-user_.avatar]:!text-[10px] [&_.action-label]:!text-[11px] [&_.resource-pill]:!text-[10px] [&_.resource-name]:!text-[12px] [&_.context-main]:!text-[11px] [&_.context-sub]:!text-[10px] [&_.status-pill]:!text-[10px] [&_.table-footer]:!text-[11px] [&_.pagination_button]:!text-[12px] [&_.page-footer]:!text-[11px] [&_.drawer-kicker]:!text-[11px] [&_.drawer-heading_h2]:!text-[21px] [&_.drawer-summary_strong]:!text-[13px] [&_.drawer-summary_small]:!text-[11px] [&_.detail-section_h3]:!text-[13px] [&_.detail-section_dt]:!text-[12px] [&_.detail-section_dd]:!text-[12px] [&_.detail-section_pre]:!text-[11px] [&_.drawer-close]:!text-[13px] [&_.table-message]:!text-[14px] [&_.error-state]:!text-[14px] [&_.empty-state_strong]:!text-[14px] [&_.empty-state_span]:!text-[12px] max-[720px]:[&_.page-heading_h1]:!text-[25px]">
      <div className="page-content w-full !w-full max-w-none">
        <div className="page-heading">
          <div>
            <h1>Activity log</h1>
            <p>See what’s happening across your workspace, all in one place.</p>
          </div>
          <button
            className="export-button"
            onClick={() => exportCsv(visibleItems)}
            disabled={visibleItems.length === 0}
          >
            <Download size={16} /> Export page
          </button>
        </div>

        <section className="activity-panel" id="activity">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>A detailed record of actions taken in your workspace.</p>
            </div>
            <button
              className="filter-toggle"
              onClick={() => document.getElementById("action-filter")?.focus()}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
          <div className="toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search activity..."
                aria-label="Search activity"
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="toolbar-filters">
              <label className="select-wrap">
                <ListFilter size={15} />
                <select
                  id="action-filter"
                  value={action}
                  onChange={(event) => {
                    setAction(event.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by action"
                >
                  <option value="">All actions</option>
                  {actions.map((value) => (
                    <option key={value} value={value}>
                      {label(value)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>
              <label className="select-wrap date-select">
                <Clock3 size={15} />
                <select
                  value={range}
                  onChange={(event) => {
                    setRange(event.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by date"
                >
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Today</option>
                  <option>All time</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <button
                className="icon-button advanced-filter"
                aria-label="Refresh activity"
                onClick={refetch}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="th-date">DATE &amp; TIME</th>
                  <th>USER</th>
                  <th>ACTION</th>
                  <th>RESOURCE</th>
                  <th>WORKSPACE / PROJECT</th>
                  <th>STATUS</th>
                  <th className="th-more">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") setSelected(entry);
                    }}
                  >
                    <td className="date-cell">
                      <span>{formatDate(entry.created_at)}</span>
                      <small>
                        {new Intl.DateTimeFormat("en-IN", {
                          timeStyle: "short",
                        }).format(new Date(entry.created_at))}
                      </small>
                    </td>
                    <td>
                      <div className="table-user">
                        <span className="avatar avatar-blue">
                          {displayUser(entry)
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span>
                          <strong>{displayUser(entry)}</strong>
                          <small>
                            {entry.user_email ||
                              shortId(entry.user_id) ||
                              "System event"}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="action-label">
                        <span className="action-dot" />
                        {label(entry.action)}
                      </span>
                    </td>
                    <td>
                      <span className="resource-pill">
                        {label(entry.resource_type)}
                      </span>
                      <span className="resource-name">
                        {displayResource(entry)}
                      </span>
                    </td>
                    <td>
                      <span className="context-main">
                        {displayWorkspace(entry)}
                      </span>
                      <small className="context-sub">
                        {displayProject(entry)}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${entry.status.toLowerCase() === "success" ? "" : "status-pill-failed"}`}
                      >
                        <span />
                        {label(entry.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="row-more"
                        aria-label={`View ${label(entry.action)} details`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected(entry);
                        }}
                      >
                        <Ellipsis size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!isLoading && visibleItems.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <Search size={22} />
                        <strong>No activity found</strong>
                        <span>Try a different search or date range.</span>
                      </div>
                    </td>
                  </tr>
                )}
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="table-message">
                      Loading activity…
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={7}>
                      <div className="error-state">
                        <strong>Showing preview activity</strong>
                        <span>
                          The activity API could not be reached: {error.message}
                        </span>
                        <button onClick={refetch}>Try again</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>
              Showing{" "}
              <strong>
                {visibleTotal ? (page - 1) * pageSize + 1 : 0}–
                {Math.min(page * pageSize, visibleTotal)}
              </strong>{" "}
              of <strong>{visibleTotal} events</strong>
            </span>
            <div className="pagination">
              <button
                aria-label="Previous page"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft size={16} />
              </button>
              <button className="page-active">{page}</button>
              <button
                aria-label="Next page"
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                disabled={page >= pageCount || isLoading}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <footer className="page-footer">
          <span>Activity log</span>
          <span>Showing the latest events from your workspace.</span>
        </footer>
      </div>

      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            className="detail-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            <div className="drawer-heading">
              <div>
                <span className="drawer-kicker">ACTIVITY DETAILS</span>
                <h2 id="detail-title">{label(selected.action)}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>
            <div className="drawer-summary">
              <span className="summary-icon indigo">
                <Filter size={17} />
              </span>
              <div>
                <strong>
                  {displayUser(selected)}{" "}
                  <span>{label(selected.action).toLowerCase()}</span>{" "}
                  <b>{displayResource(selected)}</b>
                </strong>
                <small>{formatDate(selected.created_at, true)}</small>
              </div>
            </div>
            <div className="detail-section">
              <h3>Event information</h3>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{label(selected.status)}</dd>
                </div>
                <div>
                  <dt>Resource type</dt>
                  <dd>{label(selected.resource_type)}</dd>
                </div>
                <div>
                  <dt>Resource ID</dt>
                  <dd className="mono">{selected.resource_id ?? "—"}</dd>
                </div>
                <div>
                  <dt>Workspace ID</dt>
                  <dd className="mono">{selected.workspace_id ?? "—"}</dd>
                </div>
                <div>
                  <dt>Project ID</dt>
                  <dd className="mono">{selected.project_id ?? "—"}</dd>
                </div>
                <div>
                  <dt>User ID</dt>
                  <dd className="mono">{selected.user_id ?? "—"}</dd>
                </div>
                <div>
                  <dt>Event ID</dt>
                  <dd className="mono">#{selected.id}</dd>
                </div>
              </dl>
            </div>
            <JsonSection title="Changed from" value={selected.changed_from} />
            <JsonSection title="Changed to" value={selected.changed_to} />
            <JsonSection title="Payload" value={selected.payload} />
            <div className="detail-section">
              <h3>Request</h3>
              <dl>
                <div>
                  <dt>IP address</dt>
                  <dd>{selected.ip_address ?? "—"}</dd>
                </div>
                <div>
                  <dt>User agent</dt>
                  <dd>{selected.user_agent ?? "—"}</dd>
                </div>
              </dl>
            </div>
            <button className="drawer-close" onClick={() => setSelected(null)}>
              Close details
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function JsonSection({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <pre>{value == null ? "—" : JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

function exportCsv(entries: AuditLogRecord[]) {
  const columns = [
    "id",
    "created_at",
    "user_id",
    "action",
    "resource_type",
    "resource_id",
    "workspace_id",
    "project_id",
    "status",
  ] as const;
  const csv = [
    columns,
    ...entries.map((entry) => columns.map((column) => entry[column] ?? "")),
  ]
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "activity-log.csv";
  link.click();
  URL.revokeObjectURL(url);
}
