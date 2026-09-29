import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Funnel,
  Search,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Users,
  GripVertical,
  Folder,
  UserRoundPlus,
  Shield,
  Building2,
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
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import image from "../../assets/img.png";

// ===================== DATA =====================

const tabs = [
  { label: "All Workspaces", count: 4 },
  { label: "My Workspace", count: 3 },
  { label: "Shared", count: 1 },
];

const proj = (id: number, name: string, description: string, date: string) => ({
  id,
  name,
  description,
  date,
  image,
});

const workspaces = [
  {
    id: 1,
    name: "Design Team",
    projectCount: 3,
    role: "OWNER",
    projects: [
      proj(1, "Website Redesign", "Company website redesign project...", "18 Sep 2026"),
      proj(2, "Brand Identity", "New branding and visual identity...", "02 Aug 2026"),
      proj(3, "Mobile App UI", "Mobile application interface...", "21 Jul 2026"),
    ],
  },
  {
    id: 2,
    name: "Engineering",
    projectCount: 2,
    role: "OWNER",
    projects: [
      proj(4, "Project Management App", "Internal project management platform...", "12 Jun 2026"),
      proj(5, "Analytics Dashboard", "Real-time analytics dashboard...", "28 May 2026"),
    ],
  },
  {
    id: 3,
    name: "Marketing",
    projectCount: 1,
    role: "OWNER",
    projects: [proj(6, "Campaign Manager", "Marketing campaign management...", "09 Apr 2026")],
  },
];

const sharedWorkspaces = [
  {
    id: 4,
    name: "Product Team",
    projectCount: 2,
    role: "MEMBER",
    projects: [
      proj(7, "Product Roadmap", "Q4 product planning and roadmap...", "15 Sep 2026"),
      proj(8, "Customer Feedback", "Customer feedback and insights...", "30 Aug 2026"),
    ],
  },
];

// ===================== TOP TOGGLE =====================

function ToggleBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex w-full items-center gap-1 rounded-sm bg-[#E5E5E5] p-1 sm:inline-flex sm:w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-[11px] transition-all sm:flex-none sm:gap-1.5 sm:px-2 sm:py-1 sm:text-sm ${
              isActive ? "bg-[#00A6F4] text-white" : "text-[#737373] hover:text-[#4D4D4D]"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`hidden h-[7px] w-[7px] shrink-0 rounded-full sm:block ${isActive ? "bg-white" : "bg-[#737373]"}`} />
            <span className="hidden sm:inline">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ===================== TOP RIGHT ACTIONS =====================

function WorkspaceActions({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#D4D4D4] bg-[#F8F8F8] px-3 py-2 text-xs text-[#525252] hover:bg-gray-50 sm:flex-none">
        <Funnel size={14} />
        <span>Filter & Sort</span>
      </button>
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
      {/* Title + count (row 1 on mobile) */}
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

      {/* Search: only when the section has more than one workspace */}
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
}: {
  project: { name: string; description: string; date: string; image: string };
}) {
  return (
    <div className="h-[206px] w-full cursor-pointer overflow-hidden rounded-md border border-[#D4D4D4] bg-[#FAFAFA] sm:w-[252px]">
      <img src={project.image} alt={project.name} className="h-[111px] w-full object-cover" />
      <div className="p-2">
        <h3 className="truncate text-[18px] font-semibold text-[#404040]">{project.name}</h3>
        <p className="truncate text-[14px] text-[#404040]">{project.description}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="rounded-sm bg-[#B8E6FE] px-1 py-0.5 text-[12px] font-semibold text-[#00A6F4]">
            PIM
          </span>
          <span className="text-[12px] font-semibold text-[#404040]">{project.date}</span>
        </div>
      </div>
    </div>
  );
}

function NewProjectCard() {
  return (
    <button className="flex h-[206px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#D4D4D4] bg-[#FAFAFA] text-[#A3A3A3] hover:bg-[#F0F0F0] sm:w-[252px]">
      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#BDBDBD]">
        <Plus size={11} />
      </div>
      <span className="text-[10px]">New Project</span>
    </button>
  );
}

// ===================== WORKSPACE GROUP =====================

const menuItem =
  "w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm text-[#404040] hover:bg-[#F5F5F5]";
const iconBtn =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]";

function WorkspaceGroup({
  workspace,
  isCollapsed,
  onToggle,
}: {
  workspace: (typeof workspaces)[number];
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: workspace.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={setNodeRef} style={style} className="border-b border-[#D4D4D4] px-2">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 px-1 py-3 sm:px-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <button
            type="button"
            {...attributes}
            {...listeners}
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
                {workspace.projectCount} {workspace.projectCount === 1 ? "Project" : "Projects"}
              </div>
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
            onClick={() => setIsProjectModalOpen(true)}
            className="hidden cursor-pointer items-center gap-1 rounded-md bg-[#00A6F4] px-2.5 py-2 text-sm text-white transition-colors hover:bg-[#0098df] sm:flex"
          >
            <Plus size={18} />
            <span>Project</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className={`hidden sm:flex ${iconBtn}`}
          >
            <Users size={19} />
          </button>

          <div ref={menuRef} className="relative">
            <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)} className={iconBtn}>
              <MoreHorizontal size={19} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 rounded-md border border-[#D4D4D4] bg-white p-1 shadow-md">
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className={`${menuItem} sm:hidden`}
                >
                  New project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className={`${menuItem} sm:hidden`}
                >
                  Team members
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalType("edit");
                    setIsMenuOpen(false);
                  }}
                  className={menuItem}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalType("delete");
                    setIsMenuOpen(false);
                  }}
                  className="w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add member modal */}
      {isAddMemberOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75"
          onClick={() => setIsAddMemberOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-[382px] overflow-hidden rounded-xl border border-[#D4D4D4] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-4">
              <h2 className="text-base font-semibold text-[#262626]">Add member to workspace</h2>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(false)}
                className="cursor-pointer text-[#737373] hover:text-[#262626]"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-5">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#737373]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@company.com"
                className="h-[39px] w-full rounded-lg border border-[#D4D4D4] bg-[#F8FAFC] px-3 text-base text-[#404040] outline-none placeholder:text-[#9CA3AF] focus:border-[#A3A3A3] sm:text-xs"
              />

              <div className="mt-7 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="cursor-pointer px-3 py-2 text-sm text-[#525252] hover:text-[#262626]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!email.trim()}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                    email.trim()
                      ? "cursor-pointer bg-[#00A6F4] hover:bg-[#0098df]"
                      : "cursor-not-allowed bg-[#A7ACB2]"
                  }`}
                >
                  Send invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 gap-4 px-2 pb-4 sm:flex sm:flex-wrap sm:gap-7">
          {workspace.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {workspace.projects.length === 0 && <NewProjectCard />}
        </div>
      )}

      {modalType === "edit" && (
        <EditWorkspaceModal workspace={workspace} onClose={() => setModalType(null)} />
      )}
      {modalType === "delete" && (
        <DeleteWorkspaceModal workspace={workspace} onClose={() => setModalType(null)} />
      )}
      {isProjectModalOpen && (
        <ProjectModal workspace={workspace} onClose={() => setIsProjectModalOpen(false)} />
      )}

      {/* Team sidebar */}
      <div
        className={`fixed inset-0 z-[90] bg-black/30 transition-opacity duration-300 ${
          isProfileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsProfileOpen(false)}
      />
      <div
        className={`fixed right-0 top-0 z-[100] h-full w-full max-w-[360px] bg-white shadow-xl transition-transform duration-300 ease-out ${
          isProfileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-1">
          <div className="flex flex-col">
            <h2 className="text-md font-semibold text-[#404040]">Workspace Team</h2>
            <p className="py-1.5 text-sm">{workspace.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileOpen(false)}
            className="cursor-pointer text-[#737373] hover:text-[#2d2d2d]"
          >
            ✕
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
      </div>
    </div>
  );
}

// ===================== MODALS =====================

function ProjectModal({
  workspace,
  onClose,
}: {
  workspace: (typeof workspaces)[number];
  onClose: () => void;
}) {
  const [projectType, setProjectType] = useState<"PIM" | "AIM">("PIM");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-[385px] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#00A6F4]">
            <Folder size={16} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#171717]">New project</h2>
            <p className="text-[10px] text-[#737373]">Choose PIM or AIM project type</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-black hover:text-[#404040]"
          >
            ×
          </button>
        </div>

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

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Library Building Phase 1"
              className="w-full rounded-lg border border-[#D4D4D4] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4] sm:text-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional — describe the project scope"
              className="h-[70px] w-full resize-none rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4] sm:text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-[#E5E5E5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-xs font-medium text-[#737373] hover:text-[#404040]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!projectName.trim()}
            onClick={() => {
              console.log("Create project:", {
                workspaceId: workspace.id,
                projectType,
                projectName,
                description,
              });
              onClose();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#00A6F4] px-4 py-2 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

function EditWorkspaceModal({
  workspace,
  onClose,
}: {
  workspace: (typeof workspaces)[number];
  onClose: () => void;
}) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[385px] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#171717]">Edit workspace</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-800 hover:text-[#404040]"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-black">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-base text-[#404040] outline-none focus:border-[#00A6F4] sm:text-xs"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-black">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="h-[68px] w-full resize-none rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-gray-500 focus:border-[#00A6F4] sm:text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-[#E5E5E5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Save workspace:", { id: workspace.id, name, description });
              onClose();
            }}
            className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-xs font-medium text-white hover:bg-gray-900"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteWorkspaceModal({
  workspace,
  onClose,
}: {
  workspace: (typeof workspaces)[number];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[385px] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#171717]">Delete workspace</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-800 hover:text-[#404040]"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="text-sm text-[#404040]">
            Are you sure you want to delete <span className="font-semibold">{workspace.name}</span>?
          </p>
          <p className="mt-2 text-xs text-[#737373]">This action cannot be undone.</p>
        </div>

        <div className="flex justify-end gap-3 border-[#E5E5E5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Delete workspace:", workspace.id);
              onClose();
            }}
            className="cursor-pointer rounded-md bg-[#DC2626] px-3 py-2 text-xs font-medium text-white hover:bg-[#B91C1C]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function NewWorkspaceModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[385px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#00A6F4]">
            <Building2 size={16} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#171717]">New workspace</h2>
            <p className="text-[10px] text-[#737373]">Create a workspace to organise your projects</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-black hover:text-[#404040]"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. YCPA Chennai Office"
              className="w-full rounded-lg border border-[#D4D4D4] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4] sm:text-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this workspace be used for?"
              className="h-[70px] w-full resize-none rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-base text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4] sm:text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 border-t border-[#E5E5E5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-xs font-medium text-[#737373] hover:text-[#404040]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => {
              console.log("Create workspace:", { name, description });
              onClose();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#00A6F4] px-4 py-2 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
            Create workspace
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================

export default function Workspace() {
  const [workspaceItems, setWorkspaceItems] = useState(workspaces);
  const [sharedWorkspaceItems, setSharedWorkspaceItems] = useState(sharedWorkspaces);
  const [collapsedWorkspaces, setCollapsedWorkspaces] = useState<number[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("All Workspaces");
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false);

  const toggleWorkspace = (workspaceId: number) =>
    setCollapsedWorkspaces((prev) =>
      prev.includes(workspaceId) ? prev.filter((id) => id !== workspaceId) : [...prev, workspaceId]
    );

  const toggleSection = (section: string) =>
    setCollapsedSections((prev) =>
      prev.includes(section) ? prev.filter((item) => item !== section) : [...prev, section]
    );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const reorder = (setter: typeof setWorkspaceItems) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setter((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const showMy = activeTab === "All Workspaces" || activeTab === "My Workspace";
  const showShared = activeTab === "All Workspaces" || activeTab === "Shared";

  const [searchMy, setSearchMy] = useState("");
  const [searchShared, setSearchShared] = useState("");

  // Keep only projects matching the query; hide workspaces with no matches
  const filterItems = (items: typeof workspaces, query: string) => {
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
  };

  // Search bar only appears when a section has more than 1 project in total
  const countProjects = (items: typeof workspaces) =>
    items.reduce((total, w) => total + w.projects.length, 0);
  const canSearchMy = countProjects(workspaceItems) > 1;
  const canSearchShared = countProjects(sharedWorkspaceItems) > 1;

  const myVisible = filterItems(workspaceItems, canSearchMy ? searchMy : "");
  const sharedVisible = filterItems(sharedWorkspaceItems, canSearchShared ? searchShared : "");

  const noResults = <p className="px-4 py-6 text-sm text-[#737373]">No projects found</p>;

  const renderList = (
    items: typeof workspaces,
    onDragEnd: (event: DragEndEvent) => void
  ) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        <div>
          {items.map((workspace) => (
            <WorkspaceGroup
              key={workspace.id}
              workspace={workspace}
              isCollapsed={collapsedWorkspaces.includes(workspace.id)}
              onToggle={() => toggleWorkspace(workspace.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-500">
      <div className="flex flex-col gap-3 border-[#D4D4D4] px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <WorkspaceActions onAdd={() => setIsNewWorkspaceOpen(true)} />
      </div>

      {showMy && (
        <SectionHeader
          title="My Workspace"
          activeCount={3}
          isCollapsed={collapsedSections.includes("my")}
          onToggle={() => toggleSection("my")}
          showSearch={canSearchMy}
          query={searchMy}
          onQueryChange={setSearchMy}
        />
      )}
      {showMy &&
        !collapsedSections.includes("my") &&
        (myVisible.length > 0 ? renderList(myVisible, reorder(setWorkspaceItems)) : noResults)}

      {showShared && (
        <SectionHeader
          title="Shared"
          activeCount={1}
          isCollapsed={collapsedSections.includes("shared")}
          onToggle={() => toggleSection("shared")}
          showSearch={canSearchShared}
          query={searchShared}
          onQueryChange={setSearchShared}
        />
      )}
      {showShared &&
        !collapsedSections.includes("shared") &&
        (sharedVisible.length > 0
          ? renderList(sharedVisible, reorder(setSharedWorkspaceItems))
          : noResults)}

      {isNewWorkspaceOpen && <NewWorkspaceModal onClose={() => setIsNewWorkspaceOpen(false)} />}
    </div>
  );
}