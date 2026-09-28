import { useState } from "react";
import {
  Plus,
  Funnel,
  Search,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Users,
  GripVertical,
} from "lucide-react";

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

function ToggleBar() {
  const [activeTab, setActiveTab] = useState("All Workspaces");

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
            <ChevronDown size={20} />
          ) : (
            <ChevronUp size={20} />
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
    <div className="h-[206px] w-[252px] overflow-hidden rounded-md border border-[#D4D4D4] bg-[#FAFAFA]">

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
  return (
    <div className="border-b border-[#D4D4D4] px-2">

      {/* Workspace Header */}
      <div className="flex items-center justify-between px-2 py-3">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          {/* Drag Handle */}
          <GripVertical
            size={20}
            className="cursor-grab text-[#737373]"
          />

          {/* Workspace Toggle */}
          <button
            onClick={onToggle}
            className="cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronDown
                size={20}
                className="text-[#737373]"
              />
            ) : (
              <ChevronUp
                size={20}
                className="text-[#737373]"
              />
            )}
          </button>

          {/* Avatar */}
          <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#E5E5E5] text-[18px] text-[#404040]">
            PS
          </div>

          {/* Workspace Info */}
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


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* Add Project */}
          <button className="flex cursor-pointer items-center gap-1 rounded-md bg-[#00A6F4] px-2.5 py-1.5 text-sm text-white transition-colors hover:bg-[#0098df]">
            <Plus size={18} />
            <span>Project</span>
          </button>

          {/* Members */}
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <Users size={19} />
          </button>

          {/* More */}
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <MoreHorizontal size={19} />
          </button>

        </div>
      </div>


      {/* PROJECTS */}
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

    </div>
  );
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function Workspace() {

  // Individual PSG collapsed states
  const [collapsedWorkspaces, setCollapsedWorkspaces] =
    useState<number[]>([]);

  // Entire My Workspace / Shared collapsed states
  const [collapsedSections, setCollapsedSections] =
    useState<string[]>([]);
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


  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-500">
      <div className="flex flex-col gap-2 border-[#D4D4D4] px-2 py-5 sm:flex-row sm:items-center sm:justify-between">

        <ToggleBar />

        <WorkspaceActions />

      </div>

      <SectionHeader
        title="My Workspace"
        activeCount={3}
        isCollapsed={collapsedSections.includes("my")}
        onToggle={() => toggleSection("my")}
      />
      {!collapsedSections.includes("my") && (
        <div>
          {workspaces.map((workspace) => (
            <WorkspaceGroup
              key={workspace.id}
              workspace={workspace}
              isCollapsed={collapsedWorkspaces.includes(workspace.id)}
              onToggle={() => toggleWorkspace(workspace.id)}
            />
          ))}
        </div>
      )}

      <SectionHeader
        title="Shared"
        activeCount={1}
        isCollapsed={collapsedSections.includes("shared")}
        onToggle={() => toggleSection("shared")}
      />

      {!collapsedSections.includes("shared") && (
        <div>
          {sharedWorkspaces.map((workspace) => (
            <WorkspaceGroup
              key={workspace.id}
              workspace={workspace}
              isCollapsed={collapsedWorkspaces.includes(workspace.id)}
              onToggle={() => toggleWorkspace(workspace.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
}