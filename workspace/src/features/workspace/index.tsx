import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Folder,
  Funnel,
  GripVertical,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { defaultProjectImage, myWorkspacesMock, sharedWorkspacesMock, tabLabelsMock } from "../../mock/workspace";
import type {
  FilterState,
  Project,
  ProjectFilter,
  ProjectUpdate,
  RoleFilter,
  SortOption,
  TabLabel,
  Workspace,
  WorkspaceHandlers,
  WorkspaceUpdate,
  NewProject,
  ProjectType,
} from "../../types/workspace";

// ===================== HELPERS =====================

const pluralize = (count: number, singular: string) =>
  `${count} ${count === 1 ? singular : `${singular}s`}`;

const countProjects = (items: Workspace[]) =>
  items.reduce((total, w) => total + w.projects.length, 0);

function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

/** Role / project-count filters + sorting. Returns a new array. */
function applyWorkspaceFilters(
  items: Workspace[],
  roleFilter: RoleFilter,
  projectFilter: ProjectFilter,
  sortBy: SortOption
): Workspace[] {
  const filtered = items.filter((w) => {
    const matchesRole = roleFilter === "all" || w.role === roleFilter;
    const matchesCount =
      projectFilter === "all" ||
      (projectFilter === "one" && w.projects.length === 1) ||
      (projectFilter === "multiple" && w.projects.length >= 2);
    return matchesRole && matchesCount;
  });

  const sorters: Record<SortOption, ((a: Workspace, b: Workspace) => number) | null> = {
    default: null,
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "name-desc": (a, b) => b.name.localeCompare(a.name),
    "projects-high": (a, b) => b.projects.length - a.projects.length,
    "projects-low": (a, b) => a.projects.length - b.projects.length,
  };
  const sorter = sorters[sortBy];
  return sorter ? [...filtered].sort(sorter) : filtered;
}

/** Keep only projects matching the query; drop workspaces left with no matches. */
function applyProjectSearch(items: Workspace[], query: string): Workspace[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items
    .map((w) => ({
      ...w,
      projects: w.projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ),
    }))
    .filter((w) => w.projects.length > 0);
}

// ===================== SHARED UI =====================

const menuItemClass =
  "w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm text-[#404040] hover:bg-[#F5F5F5]";

const menuDangerItemClass =
  "w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm text-red-500 hover:bg-red-50";

const iconButtonClass =
  "h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]";

const inputClass =
  "w-full rounded-lg border border-[#D4D4D4] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4] sm:text-xs";

const selectClass =
  "w-full rounded-md border border-[#D4D4D4] bg-white px-2.5 py-2.5 text-base text-[#404040] outline-none focus:border-[#00A6F4] sm:py-2 sm:text-xs";

const fieldLabelClass = "mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={fieldLabelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  icon,
  onClose,
  children,
  overlayClassName = "z-[100] bg-black/40 backdrop-blur-sm",
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${overlayClassName}`}
      onClick={onClose}
    >
      <div
        className="mx-4 max-h-[90vh] w-full max-w-[385px] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-5 py-4">
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#00A6F4]">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#171717]">{title}</h2>
            {subtitle && <p className="text-[10px] text-[#737373]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-[#737373] hover:text-[#262626]"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmIcon,
  disabled,
  variant = "primary",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmIcon?: ReactNode;
  disabled?: boolean;
  variant?: "primary" | "danger";
}) {
  const confirmColor =
    variant === "danger" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#00A6F4] hover:bg-[#0098df]";

  return (
    <div className="flex items-center justify-end gap-5 border-t border-[#E5E5E5] px-5 py-3.5">
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer text-xs font-medium text-[#737373] hover:text-[#404040]"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onConfirm}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmColor}`}
      >
        {confirmIcon}
        {confirmLabel}
      </button>
    </div>
  );
}

// ===================== TOP BAR =====================

function ToggleBar({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { label: TabLabel; count: number }[];
  activeTab: TabLabel;
  onChange: (tab: TabLabel) => void;
}) {
  return (
    <div className="flex w-full items-center gap-1 rounded-sm bg-[#E5E5E5] p-1 sm:inline-flex sm:w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-[11px] transition-all sm:flex-none sm:gap-1.5 sm:px-2 sm:py-1 sm:text-sm ${
              isActive ? "bg-[#00A6F4] text-white" : "text-[#737373] hover:text-[#4D4D4D]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`hidden h-[7px] w-[7px] shrink-0 rounded-full sm:block ${
                isActive ? "bg-white" : "bg-[#737373]"
              }`}
            />
            <span className="hidden sm:inline">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function FilterSortMenu({
  filters,
  onChange,
  onReset,
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

  const hasActiveOptions =
    filters.roleFilter !== "all" || filters.projectFilter !== "all" || filters.sortBy !== "default";

  return (
    <div ref={menuRef} className="relative flex-1 sm:flex-none">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors sm:w-auto ${
          hasActiveOptions
            ? "border-[#00A6F4] bg-[#EFF6FF] text-[#00A6F4]"
            : "border-[#D4D4D4] bg-[#F8F8F8] text-[#525252] hover:bg-gray-50"
        }`}
      >
        <Funnel size={14} />
        <span>Filter & Sort</span>
        {hasActiveOptions && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00A6F4] px-1 text-[9px] font-semibold text-white">
            !
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile-only backdrop */}
          <div
            className="fixed inset-0 z-[79] bg-black/30 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom sheet on mobile, anchored dropdown from sm up */}
          <div
            className="fixed inset-x-0 bottom-0 z-[80] max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[#D4D4D4] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-11 sm:max-h-none sm:w-[250px] sm:overflow-visible sm:rounded-lg sm:border sm:p-3 sm:pb-3 sm:shadow-lg"
          >
          <div className="mb-4 flex items-center justify-between sm:mb-3">
            <h3 className="text-base font-semibold text-[#404040] sm:text-sm">Filter & Sort</h3>
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-sm text-[#00A6F4] hover:underline sm:text-[11px]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-[#737373]">
                Workspace Role
              </label>
              <select
                value={filters.roleFilter}
                onChange={(e) => onChange({ roleFilter: e.target.value as RoleFilter })}
                className={selectClass}
              >
                <option value="all">All roles</option>
                <option value="OWNER">Owner</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-[#737373]">
                Projects
              </label>
              <select
                value={filters.projectFilter}
                onChange={(e) => onChange({ projectFilter: e.target.value as ProjectFilter })}
                className={selectClass}
              >
                <option value="all">Any project count</option>
                <option value="one">1 project</option>
                <option value="multiple">2+ projects</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-[#737373]">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
                className={selectClass}
              >
                <option value="default">Default order</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
                <option value="projects-high">Projects: High → Low</option>
                <option value="projects-low">Projects: Low → High</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-5 w-full cursor-pointer rounded-lg bg-[#00A6F4] py-2.5 text-sm font-medium text-white hover:bg-[#0098df] sm:hidden"
          >
            Done
          </button>
          </div>
        </>
      )}
    </div>
  );
}

function WorkspaceActions({
  onAdd,
  filters,
  onFiltersChange,
  onFiltersReset,
}: {
  onAdd: () => void;
  filters: FilterState;
  onFiltersChange: (patch: Partial<FilterState>) => void;
  onFiltersReset: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <FilterSortMenu filters={filters} onChange={onFiltersChange} onReset={onFiltersReset} />
      <button
        type="button"
        onClick={onAdd}
        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#00A6F4] px-3 py-2 text-xs text-white hover:bg-[#0098df] sm:flex-none"
      >
        <Plus size={15} />
        <span>Workspace</span>
      </button>
    </div>
  );
}

// ===================== SECTION HEADER =====================

function SectionHeader({
  title,
  activeCount,
  isCollapsed,
  onToggle,
  showSearch,
  query,
  onQueryChange,
}: {
  title: string;
  activeCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
  showSearch: boolean;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 border-b border-[#D4D4D4] px-3 py-3 sm:gap-x-5">
      {/* Title + count */}
      <div className="flex items-center gap-3 sm:mr-auto sm:gap-5">
        <h2 className="text-base font-medium text-[#404040] sm:text-lg">{title}</h2>
        <span className="rounded-sm bg-[#D4D4D4] px-1.5 py-0.5 text-xs text-[#404040] sm:text-sm">
          {activeCount} Active
        </span>
      </div>

      {/* Chevron: top-right on mobile, far right on desktop */}
      <button
        onClick={onToggle}
        className="order-2 ml-auto cursor-pointer text-[#404040] sm:order-3 sm:ml-0"
      >
        {isCollapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {showSearch && (
        <div className="order-3 flex w-full items-center gap-1.5 rounded-md border border-[#737373] bg-white px-2 py-1.5 sm:order-2 sm:w-auto sm:gap-1 sm:py-1">
          <Search size={14} className="shrink-0 text-[#737373]" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search Project"
            className="w-full min-w-0 bg-transparent text-base text-[#404040] outline-none placeholder:text-[#737373] sm:w-[110px] sm:text-[11px]"
          />
        </div>
      )}
    </div>
  );
}

// ===================== CARDS =====================

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const pick = (action: () => void) => () => {
    action();
    setIsMenuOpen(false);
  };

  return (
    // Outer wrapper is not overflow-hidden so the dropdown can extend past the card edge
    <div className="group relative h-[206px] w-full sm:w-[252px]">
      <div className="h-full w-full cursor-pointer overflow-hidden rounded-md border border-[#D4D4D4] bg-[#FAFAFA]">
        <img src={project.image} alt={project.name} className="h-[111px] w-full object-cover" />
        <div className="p-2">
          <h3 className="truncate text-[18px] font-semibold text-[#404040]">{project.name}</h3>
          <p className="truncate text-[14px] text-[#404040]">{project.description}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="rounded-sm bg-[#B8E6FE] px-1 py-0.5 text-[12px] font-semibold text-[#00A6F4]">
              {project.type}
            </span>
            <span className="text-[12px] font-semibold text-[#404040]">{project.date}</span>
          </div>
        </div>
      </div>

      {/* Always visible on touch screens, revealed on hover (or while open) from sm up */}
      <div
        ref={menuRef}
        className={`absolute right-2 top-2 z-10 transition-opacity ${
          isMenuOpen
            ? "opacity-100"
            : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Project actions"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#D4D4D4] bg-white/95 text-[#525252] shadow-sm transition-colors hover:bg-[#F5F5F5]"
        >
          <MoreHorizontal size={16} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-9 z-20 w-36 rounded-md border border-[#D4D4D4] bg-white p-1 shadow-md">
            <button type="button" onClick={pick(onEdit)} className={menuItemClass}>
              Edit
            </button>
            <button type="button" onClick={pick(onDelete)} className={menuDangerItemClass}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-[206px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#D4D4D4] bg-[#FAFAFA] text-[#A3A3A3] hover:bg-[#F0F0F0] sm:w-[252px]">
      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#BDBDBD]">
        <Plus size={11} />
      </div>
      <span className="text-[10px]">New Project</span>
    </button>
  );
}

// ===================== MODALS =====================

function NewWorkspaceModal({ onCreate, onClose }: {  onCreate: (workspace: WorkspaceUpdate) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal
      title="New workspace"
      subtitle="Create a workspace to organise your projects"
      icon={<Building2 size={16} />}
      onClose={onClose}
    >
      <div className="space-y-4 px-5 py-5">
        <Field label="Workspace Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. YCPA Chennai Office"
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will this workspace be used for?"
            className={`${inputClass} h-[70px] resize-none`}
          />
        </Field>
      </div>
      <ModalFooter
        onCancel={onClose}
        disabled={!name.trim()}
        confirmLabel="Create workspace"
        confirmIcon={<Plus size={14} />}
        onConfirm={() => {
          onCreate({ name: name.trim(), description: description.trim() });
          onClose();
        }}
      />
    </Modal>
  );
}

function EditWorkspaceModal({
  workspace,
  onSave,
  onClose,
}: {
  workspace: Workspace;
  onSave: (patch: WorkspaceUpdate) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);

  return (
    <Modal title="Edit workspace" onClose={onClose}>
      <div className="space-y-4 px-5 py-5">
        <Field label="Workspace Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={`${inputClass} h-[68px] resize-none`}
          />
        </Field>
      </div>
      <ModalFooter
        onCancel={onClose}
        disabled={!name.trim()}
        confirmLabel="Save changes"
        onConfirm={() => {
          onSave({ name: name.trim(), description: description.trim() });
          onClose();
        }}
      />
    </Modal>
  );
}

function DeleteWorkspaceModal({
  workspace,
  onConfirm,
  onClose,
}: {
  workspace: Workspace;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Delete workspace" onClose={onClose}>
      <div className="px-5 py-6">
        <p className="text-sm text-[#404040]">
          Are you sure you want to delete <span className="font-semibold">{workspace.name}</span>?
        </p>
        <p className="mt-2 text-xs text-[#737373]">This action cannot be undone.</p>
      </div>
      <ModalFooter
        onCancel={onClose}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={() => {
          onConfirm();
          onClose();
        }}
      />
    </Modal>
  );
}

function EditProjectModal({
  project,
  onSave,
  onClose,
}: {
  project: Project;
  onSave: (patch: ProjectUpdate) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  return (
    <Modal title="Edit project" onClose={onClose}>
      <div className="space-y-4 px-5 py-5">
        <Field label="Project Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={`${inputClass} h-[68px] resize-none`}
          />
        </Field>
      </div>
      <ModalFooter
        onCancel={onClose}
        disabled={!name.trim()}
        confirmLabel="Save changes"
        onConfirm={() => {
          onSave({ name: name.trim(), description: description.trim() });
          onClose();
        }}
      />
    </Modal>
  );
}

function DeleteProjectModal({
  project,
  onConfirm,
  onClose,
}: {
  project: Project;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Delete project" onClose={onClose}>
      <div className="px-5 py-6">
        <p className="text-sm text-[#404040]">
          Are you sure you want to delete <span className="font-semibold">{project.name}</span>?
        </p>
        <p className="mt-2 text-xs text-[#737373]">This action cannot be undone.</p>
      </div>
      <ModalFooter
        onCancel={onClose}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={() => {
          onConfirm();
          onClose();
        }}
      />
    </Modal>
  );
}

function ProjectModal({ workspace, onClose, onCreate }: { workspace: Workspace; onClose: () => void; onCreate: (project: NewProject) => void; }) {
  const [projectType, setProjectType] = useState<"PIM" | "AIM">("PIM");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal
      title="New project"
      subtitle="Choose PIM or AIM project type"
      icon={<Folder size={16} />}
      onClose={onClose}
    >
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-700 text-xs font-semibold text-white">
            {workspace.name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-[#404040]">{workspace.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold uppercase text-[#737373]">Project Type</label>
          <div className="flex rounded-lg border border-[#E2E8F0] bg-[#F8F8F8] p-0.5">
            {(["PIM", "AIM"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setProjectType(type)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  projectType === type ? "bg-white text-[#00A6F4] shadow-sm" : "text-[#737373]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Field label="Project Name" required>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Library Building Phase 1"
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional — describe the project scope"
            className={`${inputClass} h-[70px] resize-none`}
          />
        </Field>
      </div>
      <ModalFooter
        onCancel={onClose}
        disabled={!projectName.trim()}
        confirmLabel="Create project"
        confirmIcon={<Plus size={14} />}
        onConfirm={() => {
        onCreate({
          name: projectName.trim(),
          description: description.trim(),
          type: projectType,
        });
        onClose();
      }}
      />
    </Modal>
  );
}

function AddMemberModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const canSend = email.trim().length > 0;

  return (
    <Modal
      title="Add member to workspace"
      onClose={onClose}
      overlayClassName="z-[200] bg-black/75"
    >
      <div className="px-5 py-5">
        <Field label="Email address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@company.com"
            className={`${inputClass} h-[39px] bg-[#F8FAFC]`}
          />
        </Field>
      </div>
      <ModalFooter
        onCancel={onClose}
        disabled={!canSend}
        confirmLabel="Send invite"
        onConfirm={() => {
          console.log("Invite member:", email);
          onClose();
        }}
      />
    </Modal>
  );
}

// ===================== TEAM SIDEBAR =====================

function TeamSidebar({
  workspace,
  isOpen,
  onClose,
}: {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-[100] h-full w-full max-w-[360px] bg-white shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-1">
          <div className="flex flex-col">
            <h2 className="text-md font-semibold text-[#404040]">Workspace Team</h2>
            <p className="py-1.5 text-sm">{workspace.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-[#737373] hover:text-[#2d2d2d]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex flex-col">
            <p className="text-base font-semibold text-[#404040]">Team Members</p>
            <p className="text-sm">1 member in this workspace</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-[#1f1f1f]"
          >
            <UserRoundPlus size={20} />
            Add member
          </button>
        </div>

        <div className="mx-5 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={13} strokeWidth={2} className="text-[#00A6F4]" />
            <span className="text-[11px] font-semibold tracking-wide text-[#00A6F4]">ADMINS</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                P
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#262626]">Peter</span>
                  <span className="rounded bg-[#F5F5F5] px-1.5 py-0.5 text-[9px] text-[#737373]">
                    you
                  </span>
                </div>
                <span className="mt-0.5 truncate text-[11px] text-[#737373]">
                  peterparker@gmail.com
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#EFF6FF] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A6F4]" />
              <span className="text-[11px] font-semibold text-[#00A6F4]">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {isAddMemberOpen && <AddMemberModal onClose={() => setIsAddMemberOpen(false)} />}
    </>
  );
}

// ===================== WORKSPACE GROUP =====================

type GroupModal = "edit" | "delete" | "project" | "editProject" | "deleteProject" | null;

function WorkspaceGroup({
  workspace,
  isCollapsed,
  onToggle,
  handlers,
}: {
  workspace: Workspace;
  isCollapsed: boolean;
  onToggle: () => void;
  handlers: WorkspaceHandlers;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: workspace.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<GroupModal>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const closeModal = () => {
    setModalType(null);
    setSelectedProject(null);
  };

  const openProjectModal = (type: "editProject" | "deleteProject", target: Project) => {
    setSelectedProject(target);
    setModalType(type);
  };

  const openFromMenu = (action: () => void) => () => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="border-b border-[#D4D4D4] px-2">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 px-1 py-3 sm:px-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder"
              className="touch-none cursor-grab text-[#737373] active:cursor-grabbing"
            >
              <GripVertical size={20} />
            </button>

            <button onClick={onToggle} className="cursor-pointer">
              {isCollapsed ? (
                <ChevronUp size={20} className="text-[#737373]" />
              ) : (
                <ChevronDown size={20} className="text-[#737373]" />
              )}
            </button>

            <div className="hidden h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#E5E5E5] text-[18px] text-[#404040] sm:flex">
              PS
            </div>

            <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 leading-tight">
                <div className="truncate text-base font-medium text-[#404040] sm:text-[18px]">
                  {workspace.name}
                </div>
                <div className="text-xs text-[#737373] sm:text-sm">
                  {pluralize(workspace.projects.length, "Project")}
                </div>
                {workspace.description && (
                  <div className="mt-0.5 max-w-[260px] truncate text-xs text-[#737373] sm:max-w-[360px]">
                    {workspace.description}
                  </div>
                )}
              </div>
              <span className="w-fit shrink-0 rounded-sm border border-[#737373] px-1.5 py-0.5 text-[11px] leading-none text-[#737373] sm:text-[12px]">
                {workspace.role}
              </span>
            </div>
          </div>

          {/* Actions: full buttons on desktop, single menu on mobile */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setModalType("project")}
              className="hidden cursor-pointer items-center gap-1 rounded-md bg-[#00A6F4] px-2.5 py-2 text-sm text-white transition-colors hover:bg-[#0098df] sm:flex"
            >
              <Plus size={18} />
              <span>Project</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTeamOpen(true)}
              aria-label="Team members"
              className={`hidden sm:flex ${iconButtonClass}`}
            >
              <Users size={19} />
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="More actions"
                className={`flex ${iconButtonClass}`}
              >
                <MoreHorizontal size={19} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-44 rounded-md border border-[#D4D4D4] bg-white p-1 shadow-md">
                  <button
                    type="button"
                    onClick={openFromMenu(() => setModalType("project"))}
                    className={`${menuItemClass} sm:hidden`}
                  >
                    New project
                  </button>
                  <button
                    type="button"
                    onClick={openFromMenu(() => setIsTeamOpen(true))}
                    className={`${menuItemClass} sm:hidden`}
                  >
                    Team members
                  </button>
                  <button
                    type="button"
                    onClick={openFromMenu(() => setModalType("edit"))}
                    className={menuItemClass}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={openFromMenu(() => setModalType("delete"))}
                    className={menuDangerItemClass}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        {!isCollapsed && (
          <div className="grid grid-cols-1 gap-4 px-2 pb-4 sm:flex sm:flex-wrap sm:gap-7">
            {workspace.projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={() => openProjectModal("editProject", p)}
                onDelete={() => openProjectModal("deleteProject", p)}
              />
            ))}
            {workspace.projects.length === 0 && (
              <NewProjectCard onClick={() => setModalType("project")} />
            )}
          </div>
        )}
      </div>

      {/*
        Overlays are siblings of the sortable row, not children. Fixed-position elements
        inside a transformed parent (which dnd-kit applies while dragging) get positioned
        relative to that parent instead of the viewport.
      */}
      {modalType === "edit" && (
        <EditWorkspaceModal
          workspace={workspace}
          onSave={(patch) => handlers.onEditWorkspace(workspace.id, patch)}
          onClose={closeModal}
        />
      )}
      {modalType === "delete" && (
        <DeleteWorkspaceModal
          workspace={workspace}
          onConfirm={() => handlers.onDeleteWorkspace(workspace.id)}
          onClose={closeModal}
        />
      )}
      {modalType === "project" && (
        <ProjectModal
          workspace={workspace}
          onCreate={(project) => handlers.onAddProject(workspace.id, project)}
          onClose={closeModal}
        />
      )}
      {modalType === "editProject" && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onSave={(patch) => handlers.onEditProject(workspace.id, selectedProject.id, patch)}
          onClose={closeModal}
        />
      )}
      {modalType === "deleteProject" && selectedProject && (
        <DeleteProjectModal
          project={selectedProject}
          onConfirm={() => handlers.onDeleteProject(workspace.id, selectedProject.id)}
          onClose={closeModal}
        />
      )}
      <TeamSidebar workspace={workspace} isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />
    </>
  );
}

// ===================== SORTABLE LIST =====================

function WorkspaceList({
  items,
  collapsedIds,
  onToggle,
  onReorder,
  handlers,
}: {
  items: Workspace[];
  collapsedIds: number[];
  onToggle: (id: number) => void;
  onReorder: (activeId: number, overId: number) => void;
  handlers: WorkspaceHandlers;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) onReorder(Number(active.id), Number(over.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        <div>
          {items.map((workspace) => (
            <WorkspaceGroup
              key={workspace.id}
              workspace={workspace}
              isCollapsed={collapsedIds.includes(workspace.id)}
              onToggle={() => onToggle(workspace.id)}
              handlers={handlers}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ===================== MAIN PAGE =====================

const DEFAULT_FILTERS: FilterState = { roleFilter: "all", projectFilter: "all", sortBy: "default" };

const toggleInList = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function WorkspacePage() {
  const [myWorkspaces, setMyWorkspaces] = useState<Workspace[]>(myWorkspacesMock);
  const [sharedWorkspaces, setSharedWorkspaces] = useState<Workspace[]>(sharedWorkspacesMock);

  const [activeTab, setActiveTab] = useState<TabLabel>("All Workspaces");
  const [collapsedWorkspaces, setCollapsedWorkspaces] = useState<number[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchMy, setSearchMy] = useState("");
  const [searchShared, setSearchShared] = useState("");

  const counts: Record<TabLabel, number> = {
    "All Workspaces": myWorkspaces.length + sharedWorkspaces.length,
    "My Workspace": myWorkspaces.length,
    Shared: sharedWorkspaces.length,
  };
  const tabs = tabLabelsMock.map((label) => ({ label, count: counts[label] }));

  const showMy = activeTab !== "Shared";
  const showShared = activeTab !== "My Workspace";

  const reorderIn =
    (setter: typeof setMyWorkspaces) => (activeId: number, overId: number) =>
      setter((items) => {
        const from = items.findIndex((w) => w.id === activeId);
        const to = items.findIndex((w) => w.id === overId);
        return from < 0 || to < 0 ? items : arrayMove(items, from, to);
      });

  // Workspace ids are unique across both lists, so an update is applied to each list
  // and only the one that contains the id actually changes.
  const updateBoth = (fn: (items: Workspace[]) => Workspace[]) => {
    setMyWorkspaces(fn);
    setSharedWorkspaces(fn);
  };

  const handlers: WorkspaceHandlers = {
    onEditWorkspace: (workspaceId, patch) =>
      updateBoth((items) => items.map((w) => (w.id === workspaceId ? { ...w, ...patch } : w))),

    onDeleteWorkspace: (workspaceId) =>
      updateBoth((items) => items.filter((w) => w.id !== workspaceId)),

    onEditProject: (workspaceId, projectId, patch) =>
      updateBoth((items) =>
        items.map((w) =>
          w.id === workspaceId
            ? { ...w, projects: w.projects.map((p) => (p.id === projectId ? { ...p, ...patch } : p)) }
            : w
        )
      ),

    onDeleteProject: (workspaceId, projectId) =>
      updateBoth((items) =>
        items.map((w) =>
          w.id === workspaceId
            ? { ...w, projects: w.projects.filter((p) => p.id !== projectId) }
            : w
        )
      ),
      onAddProject: (workspaceId, newProject) => {
      const nextId =
        Math.max(
          0,
          ...[...myWorkspaces, ...sharedWorkspaces].flatMap((w) => w.projects.map((p) => p.id))
        ) + 1;

      const created: Project = {
        ...newProject,
        id: nextId,
        image: defaultProjectImage,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      updateBoth((items) =>
        items.map((w) =>
          w.id === workspaceId ? { ...w, projects: [...w.projects, created] } : w
        )
      );
    },
  };

  // Filter/sort first; the search box only appears when more than one project is left
  const filteredMy = applyWorkspaceFilters(
    myWorkspaces,
    filters.roleFilter,
    filters.projectFilter,
    filters.sortBy
  );
  const filteredShared = applyWorkspaceFilters(
    sharedWorkspaces,
    filters.roleFilter,
    filters.projectFilter,
    filters.sortBy
  );
  const addWorkspace = (data: WorkspaceUpdate) => {
    const nextId =
      Math.max(0, ...[...myWorkspaces, ...sharedWorkspaces].map((w) => w.id)) + 1;

    const created: Workspace = {
      id: nextId,
      name: data.name,
      description: data.description,
      role: "OWNER",
      projects: [],
    };

    setMyWorkspaces((items) => [...items, created]);
    if (activeTab === "Shared") setActiveTab("My Workspace");
  };
  const canSearchMy = countProjects(filteredMy) > 1;
  const canSearchShared = countProjects(filteredShared) > 1;

  const visibleMy = applyProjectSearch(filteredMy, canSearchMy ? searchMy : "");
  const visibleShared = applyProjectSearch(filteredShared, canSearchShared ? searchShared : "");

  const renderSection = (config: {
    key: "my" | "shared";
    title: string;
    activeCount: number;
    visible: Workspace[];
    canSearch: boolean;
    query: string;
    onQueryChange: (value: string) => void;
    onReorder: (activeId: number, overId: number) => void;
  }) => {
    const isCollapsed = collapsedSections.includes(config.key);
    return (
      <>
        <SectionHeader
          title={config.title}
          activeCount={config.activeCount}
          isCollapsed={isCollapsed}
          onToggle={() => setCollapsedSections((prev) => toggleInList(prev, config.key))}
          showSearch={config.canSearch}
          query={config.query}
          onQueryChange={config.onQueryChange}
        />
        {!isCollapsed &&
          (config.visible.length > 0 ? (
            <WorkspaceList
              items={config.visible}
              collapsedIds={collapsedWorkspaces}
              onToggle={(id) => setCollapsedWorkspaces((prev) => toggleInList(prev, id))}
              onReorder={config.onReorder}
              handlers={handlers}
            />
          ) : (
            <p className="px-4 py-6 text-sm text-[#737373]">No projects found</p>
          ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-500">
      <div className="flex flex-col gap-3 border-[#D4D4D4] px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <WorkspaceActions
          onAdd={() => setIsNewWorkspaceOpen(true)}
          filters={filters}
          onFiltersChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onFiltersReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {showMy &&
        renderSection({
          key: "my",
          title: "My Workspace",
          activeCount: myWorkspaces.length,
          visible: visibleMy,
          canSearch: canSearchMy,
          query: searchMy,
          onQueryChange: setSearchMy,
          onReorder: reorderIn(setMyWorkspaces),
        })}

      {showShared &&
        renderSection({
          key: "shared",
          title: "Shared",
          activeCount: sharedWorkspaces.length,
          visible: visibleShared,
          canSearch: canSearchShared,
          query: searchShared,
          onQueryChange: setSearchShared,
          onReorder: reorderIn(setSharedWorkspaces),
        })}

      {isNewWorkspaceOpen && (
        <NewWorkspaceModal
          onCreate={addWorkspace}
          onClose={() => setIsNewWorkspaceOpen(false)}
        />
      )}
    </div>
  );
}