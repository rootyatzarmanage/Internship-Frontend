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


// ============================================================
// DATA
// ============================================================

const tabs = [
  { label: "All Workspaces", count: 4 },
  { label: "My Workspace", count: 3 },
  { label: "Shared", count: 1 },
];

const workspaces = [
  {
    id: 1,
    name: "PSG",
    projectCount: 2,
    role: "OWNER",
    projects: [
      {
        id: 1,
        name: "PSG - Z - Block",
        description: "PSG - Y - Block Desc...",
        date: "03 Jun 2026",
        image: image,
      },
      {
        id: 2,
        name: "PSG - Z - Block",
        description: "PSG - Y - Block Desc...",
        date: "27 Feb 2025",
        image: image,
      },
    ],
  },

  {
    id: 2,
    name: "PSG",
    projectCount: 1,
    role: "OWNER",
    projects: [
      {
        id: 3,
        name: "PSG - Z - Block",
        description: "PSG - Y - Block Desc...",
        date: "17 Apr 2024",
        image: image,
      },
    ],
  },

  {
    id: 3,
    name: "PSG",
    projectCount: 1,
    role: "OWNER",
    projects: [],
  },
];

const sharedWorkspaces = [
  {
    id: 4,
    name: "PSG",
    projectCount: 1,
    role: "MEMBER",
    projects: [
      {
        id: 4,
        name: "PSG - Z - Block",
        description: "PSG - Y - Block Desc...",
        date: "26 Jun 2026",
        image: image,
      },
    ],
  },
];


// ============================================================
// TOP TOGGLE
// ============================================================

function ToggleBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-sm bg-[#E5E5E5] p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1 text-xs transition-all sm:text-sm ${
              isActive
                ? "bg-[#00A6F4] text-white"
                : "text-[#737373] hover:text-[#4D4D4D]"
            }`}
          >
            <span>{tab.label}</span>

            <span
              className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                isActive ? "bg-white" : "bg-[#737373]"
              }`}
            />

            <span>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}


// ============================================================
// TOP RIGHT ACTIONS
// ============================================================

function WorkspaceActions() {
  return (
    <div className="flex items-center gap-2">
      {/* Filter */}
      <button className="flex cursor-pointer items-center gap-2 rounded-md border border-[#D4D4D4] bg-[#F8F8F8] px-3 py-2 text-xs text-[#525252] hover:bg-gray-50">
        <Funnel size={14} />
        <span>Filter & Sort</span>
      </button>

      {/* Add Workspace */}
      <button className="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#00A6F4] px-3 py-2 text-xs text-white hover:bg-[#0098df]">
        <Plus size={15} />
        <span>Workspace</span>
      </button>
    </div>
  );
}


// ============================================================
// SECTION HEADER
// My Workspace / Shared
// ============================================================

function SectionHeader({
  title,
  activeCount,
  isCollapsed,
  onToggle,
}: {
  title: string;
  activeCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#D4D4D4] px-3 py-3">
      
      {/* Left */}
      <div className="flex items-center gap-5">
        <h2 className="text-lg font-medium text-[#404040]">
          {title}
        </h2>

        <span className="rounded-sm bg-[#D4D4D4] px-1.5 py-0.5 text-sm text-[#404040]">
          {activeCount} Active
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex items-center gap-1 rounded-md border border-[#737373] bg-white px-2 py-1">
          <Search
            size={13}
            className="text-[#737373]"
          />

          <input
            type="text"
            placeholder="Search Project"
            className="w-[110px] bg-transparent text-[11px] text-[#404040] outline-none placeholder:text-[#737373]"
          />
        </div>

        {/* Section toggle */}
        <button
          onClick={onToggle}
          className="cursor-pointer text-[#404040]"
        >
          {isCollapsed ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>
    </div>
  );
}


// ============================================================
// PROJECT CARD
// ============================================================

function ProjectCard({
  project,
}: {
  project: {
    name: string;
    description: string;
    date: string;
    image: string;
  };
}) {
  return (
    <div className="h-[206px] w-[252px] overflow-hidden rounded-md border border-[#D4D4D4] bg-[#FAFAFA] cursor-pointer">

      {/* Image */}
      <img
        src={project.image}
        alt={project.name}
        className="h-[111px] w-full object-cover"
      />

      {/* Details */}
      <div className="p-2">

        <h3 className="truncate text-[20px] font-semibold text-[#404040]">
          {project.name}
        </h3>

        <p className="truncate text-[14px] text-[#404040]">
          {project.description}
        </p>

        <div className="mt-1 flex items-center justify-between">

          <span className="rounded-sm bg-[#B8E6FE] px-1 py-0.5 text-[12px] font-semibold text-[#00A6F4]">
            PIM
          </span>

          <span className="text-[12px] font-semibold text-[#404040]">
            {project.date}
          </span>

        </div>
      </div>
    </div>
  );
}


// ============================================================
// NEW PROJECT CARD
// ============================================================

function NewProjectCard() {
  return (
    <button className="flex h-[206px] w-[252px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#D4D4D4] bg-[#FAFAFA] text-[#A3A3A3] hover:bg-[#F0F0F0]">

      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#BDBDBD]">
        <Plus size={11} />
      </div>

      <span className="text-[10px]">
        New Project
      </span>

    </button>
  );
}


// ============================================================
// WORKSPACE GROUP
// Individual PSG toggle
// ============================================================

function WorkspaceGroup({
  workspace,
  isCollapsed,
  onToggle,
}: {
  workspace: (typeof workspaces)[number];
  isCollapsed: boolean;
  onToggle: () => void;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: workspace.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div ref={setNodeRef} style={style} className="border-b border-[#D4D4D4] px-2">
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab text-[#737373] active:cursor-grabbing"
          >
            <GripVertical size={20} />
          </button>
          <button
            onClick={onToggle}
            className="cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronUp
                size={20}
                className="text-[#737373]"
              />
            ) : (
              <ChevronDown
                size={20}
                className="text-[#737373]"
              />
            )}
          </button>
          <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#E5E5E5] text-[18px] text-[#404040]">
            PS
          </div>
          <div className="flex items-center gap-4">

            {/* Name + project count */}
            <div className="leading-tight">

              <div className="text-[18px] font-medium text-[#404040]">
                {workspace.name}
              </div>

              <div className="text-sm text-[#737373]">
                {workspace.projectCount}{" "}
                {workspace.projectCount === 1
                  ? "Project"
                  : "Projects"}
              </div>

            </div>

            {/* Role */}
            <span className="rounded-sm border border-[#737373] px-1.5 py-0.5 text-[12px] leading-none text-[#737373]">
              {workspace.role}
            </span>

          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={()=> setIsProjectModalOpen(true)} className="flex cursor-pointer items-center gap-1 rounded-md bg-[#00A6F4] px-2.5 py-2 text-sm text-white transition-colors hover:bg-[#0098df]">
            <Plus size={18} />
            <span>Project</span>
          </button>

          <button type="button" onClick={() => setIsProfileOpen(true)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <Users size={19} />
          </button>
          
          <div ref={menuRef} className= "relative">
          <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <MoreHorizontal size={19} />
          </button>
          {isMenuOpen && (
            <div className = "absolute right-0 top-11 z-50 w-43.5 rounded-md border border-[#D4D4D4] bg-white p-1">
              <button type = "button" onClick={() => {setModalType("edit");
                setIsMenuOpen(false);}} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#404040] cursor-pointer hover:bg-[#F5F5F5]">Edit</button>
              <button type = "button" onClick={() => {setModalType("delete");
                setIsMenuOpen(false);}} className="w-full rounded px-2 py-1.5 text-left text-sm text-red-500 cursor-pointer hover:bg-red-50">Delete</button>
            </div>
          )}
          </div>

        </div>
      </div>

      {!isCollapsed && (
        <div className="flex flex-wrap gap-7 px-2 pb-4">

          {workspace.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* Show New Project when empty */}
          {workspace.projects.length === 0 && (
            <NewProjectCard />
          )}

        </div>
      )}
        {modalType === "edit" && (
        <EditWorkspaceModal
          workspace={workspace}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === "delete" && (
        <DeleteWorkspaceModal
          workspace={workspace}
          onClose={() => setModalType(null)}
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal
          workspace={workspace}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    <>
        <div
          className={`fixed inset-0 z-[90] bg-black/30 transition-opacity duration-300 ${
            isProfileOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsProfileOpen(false)}
        />

        {/* Right Sidebar */}
        <div
          className={`fixed right-0 top-0 z-[100] h-full w-[360px] bg-white shadow-xl transition-transform duration-300 ease-out ${
            isProfileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-1">
            <div className="flex flex-col">
              <h2 className="text-md font-semibold text-[#404040]">
                Workspace Team
              </h2>
              <p className="py-1.5 text-sm">
                {workspace.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              className="cursor-pointer text-[#737373] hover:text-[#2d2d2d]"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex flex-col">
              <p className="text-base font-semibold text-[#404040]">Team Members</p>
              <p className="text-sm">1 member in this workspace</p>
            </div>
            <button type="button" className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-black rounded-lg text-white text-sm hover:bg-[#1f1f1f]"><UserRoundPlus size={20}/>Add member</button>
          </div>
          
          <div className="bg-white px-4 py-3 border rounded-lg mx-5 border-gray-200">
            <div className="mb-3 flex items-center gap-2">
              <Shield size={13} strokeWidth={2} className="text-[#00A6F4]" />
              <span className="text-[11px] font-semibold tracking-wide text-[#00A6F4]">
                ADMINS
              </span>
            </div>

            {/* User */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  P
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#262626]">
                      Peter
                    </span>

                    <span className="rounded bg-[#F5F5F5] px-1.5 py-0.5 text-[9px] text-[#737373]">
                      you
                    </span>
                  </div>

                  <span className="mt-0.5 text-[11px] text-[#737373]">
                    peterparker@gmail.com
                  </span>
                </div>
              </div>

              {/* Admin badge */}
              <div className="flex items-center gap-1.5 rounded-md bg-[#EFF6FF] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A6F4]" />
                <span className="text-[11px] font-semibold text-[#00A6F4]">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

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
      <div className="w-[385px] overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] px-5 py-4">
          
          {/* Folder icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#00A6F4]">
            <Folder size = {16} />
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#171717]">
              New project
            </h2>

            <p className="text-[10px] text-[#737373]">
              Choose PIM or AIM project type
            </p>
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

          {/* Workspace */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-700 text-xs font-semibold text-white">
              {workspace.name.charAt(0)}
            </div>

            <span className="text-xs font-medium text-[#404040]">
              {workspace.name}
            </span>
          </div>

          {/* Project type */}
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase text-[#737373]">
              Project Type
            </label>

            <div className="flex rounded-lg border border-[#E2E8F0] bg-[#F8F8F8] p-0.5">
              <button
                type="button"
                onClick={() => setProjectType("PIM")}
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  projectType === "PIM"
                    ? "bg-white text-[#00A6F4] shadow-sm"
                    : "text-[#737373]"
                }`}
              >
                PIM
              </button>

              <button
                type="button"
                onClick={() => setProjectType("AIM")}
                className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  projectType === "AIM"
                    ? "bg-white text-[#00A6F4] shadow-sm"
                    : "text-[#737373]"
                }`}
              >
                AIM
              </button>
            </div>
          </div>

          {/* Project name */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Project Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Library Building Phase 1"
              className="w-full rounded-lg border border-[#D4D4D4] px-3 py-2.5 text-xs text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-[#737373]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional — describe the project scope"
              className="h-[70px] w-full resize-none rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-xs text-[#404040] outline-none placeholder:text-[#D4D4D4] focus:border-[#00A6F4]"
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
      <div className="w-[385px] rounded-2xl bg-white shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#171717]">
            Edit workspace
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-800 hover:text-[#404040]"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 px-5 py-5">

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-black">
              Workspace Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-xs text-[#404040] outline-none focus:border-[#00A6F4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase text-black">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="h-[68px] w-full resize-none rounded-lg border border-[#D9E2EC] px-3 py-2.5 text-xs text-[#404040] outline-none placeholder:text-gray-500 focus:border-[#00A6F4]"
            />
          </div>

        </div>

        {/* Footer */}
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
              console.log("Save workspace:", {
                id: workspace.id,
                name,
                description,
              });

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
      <div className="w-[385px] rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#171717]">
            Delete workspace
          </h2>

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
            Are you sure you want to delete{" "}
            <span className="font-semibold">{workspace.name}</span>?
          </p>

          <p className="mt-2 text-xs text-[#737373]">
            This action cannot be undone.
          </p>
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

// ============================================================
// MAIN PAGE
// ============================================================

export default function Workspace() {

  const [workspaceItems, setWorkspaceItems] = useState(workspaces);
  const [sharedWorkspaceItems, setSharedWorkspaceItems] = useState(sharedWorkspaces);
  const [collapsedWorkspaces, setCollapsedWorkspaces] = useState<number[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("All Workspaces");
  const toggleWorkspace = (workspaceId: number) => {
    setCollapsedWorkspaces((prev) =>
      prev.includes(workspaceId)
        ? prev.filter((id) => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setWorkspaceItems((items) => {
      const oldIndex = items.findIndex(
        (item) => item.id === active.id
      );

      const newIndex = items.findIndex(
        (item) => item.id === over.id
      );

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSharedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSharedWorkspaceItems((items) => {
      const oldIndex = items.findIndex(
        (item) => item.id === active.id
      );

      const newIndex = items.findIndex(
        (item) => item.id === over.id
      );

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-500">
      <div className="flex flex-col border-[#D4D4D4] px-2 py-4 sm:flex-row sm:items-center sm:justify-between">

        <ToggleBar activeTab={activeTab} setActiveTab={setActiveTab}/>

        <WorkspaceActions />

      </div>

      {(activeTab === "All Workspaces" ||
  activeTab === "My Workspace") && (
      <SectionHeader
        title="My Workspace"
        activeCount={3}
        isCollapsed={collapsedSections.includes("my")}
        onToggle={() => toggleSection("my")}
      />
  )}

    {(activeTab === "All Workspaces" ||
      activeTab === "My Workspace") &&
      !collapsedSections.includes("my") && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[
            restrictToVerticalAxis,
            restrictToParentElement,
          ]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={workspaceItems.map((workspace) => workspace.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {workspaceItems.map((workspace) => (
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
      )}

      {(activeTab === "All Workspaces" ||
        activeTab === "Shared") && (
            <SectionHeader
              title="Shared"
              activeCount={1}
              isCollapsed={collapsedSections.includes("shared")}
              onToggle={() => toggleSection("shared")}
            />
        )}

      {(activeTab === "All Workspaces" ||
      activeTab === "Shared") &&
      !collapsedSections.includes("shared") && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[
            restrictToVerticalAxis,
            restrictToParentElement,
          ]}
          onDragEnd={handleSharedDragEnd}
        >
          <SortableContext
            items={sharedWorkspaceItems.map((workspace) => workspace.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {sharedWorkspaceItems.map((workspace) => (
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
      )}

    </div>
  );
}