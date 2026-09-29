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
          <button className="flex cursor-pointer items-center gap-1 rounded-md bg-[#00A6F4] px-2.5 py-1.5 text-sm text-white transition-colors hover:bg-[#0098df]">
            <Plus size={18} />
            <span>Project</span>
          </button>

          <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <Users size={19} />
          </button>
          
          <div ref={menuRef} className= "relative">
          <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#A3A3A3] bg-white text-[#525252] transition-colors hover:bg-[#F5F5F5]">
            <MoreHorizontal size={19} />
          </button>
          {isMenuOpen && (
            <div className = "absolute right-0 top-11 z-50 w-43.5 rounded-md border border-[#D4D4D4] bg-white p-1">
              <button type = "button" className="w-full rounded px-2 py-1.5 text-left text-sm text-[#404040] cursor-pointer hover:bg-[#F5F5F5]">Edit</button>
              <button type = "button" className="w-full rounded px-2 py-1.5 text-left text-sm text-red-500 cursor-pointer hover:bg-red-50">Delete</button>
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