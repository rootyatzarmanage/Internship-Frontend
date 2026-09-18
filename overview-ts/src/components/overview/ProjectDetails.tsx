import { useState } from 'react'
import { MapPin, Calendar, Layers, User, Users } from 'lucide-react'
import backgroundImage from '../../Assets/background.png'

type Project = {
  name: string
  location: string
  description: string
  projectType: string
  latitude: number
  longitude: number
  status: string
  createdDate: string
  workspace: string
  owner: string
  membersCount: number
}

type ProjectDetailsProps = {
  project: Project
}

export default function ProjectDetails({
  project,
}: ProjectDetailsProps) {
  const [formData, setFormData] = useState({
    name: project?.name || 'PSG - Y - Block',
    location: project?.location || 'Peelamedu, Coimbatore',
    description:
      project?.description || 'PSG - Y - Block Description',
    projectType: project?.projectType || 'PIM',
    latitude: project?.latitude || 12.8493,
    longitude: project?.longitude || 77.6415,
    status: project?.status || 'Active',
    createdDate: project?.createdDate || '26 Jun 2026',
    workspace: project?.workspace || 'PSG',
    owner: project?.owner || 'Peter Parker',
    membersCount: project?.membersCount || 5,
  })

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-none dark:border-gray-800 dark:bg-gray-900">

      {/* Hero Banner */}
      <div className="relative h-78 w-full shrink-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Project background"
          className="h-full w-full object-cover object-center"
        />

        {/* Black Bottom Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Type Badge */}
        <div className="absolute bottom-4 right-5 z-10 rounded-full border border-white/50 bg-black/30 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {formData.projectType}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex flex-1 flex-col gap-6 p-6">

        {/* Title, Location & Status */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
                {formData.name}
              </h1>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-[#8c94a0]">
                <MapPin className="h-3.5 w-3.5 text-[#9ca3af]" />
                <span>{formData.location}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/40 bg-white px-3 py-1 text-xs font-medium text-[#16a34a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              {formData.status}
            </span>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-[#4b5563]">
              Description
            </h2>

            <p className="ml-2 mt-1.5 text-medium leading-relaxed text-[#374151]">
              {formData.description}
            </p>
          </div>
        </div>

        {/* Field Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">

          <div>
            <span className="block text-sm font-semibold text-[#4b5563]">
              Project Type
            </span>

            <span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">
              {formData.projectType}
            </span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-[#4b5563]">
              Location
            </span>

            <span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">
              {formData.location}
            </span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-[#4b5563]">
              Latitude
            </span>

            <span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">
              {formData.latitude}
            </span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-[#4b5563]">
              Longitude
            </span>

            <span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">
              {formData.longitude}
            </span>
          </div>
        </div>

        {/* Bottom Metadata Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

          {/* Created */}
          <div className="rounded-xl bg-[#F5F5F5] p-3.5 dark:bg-gray-800/60">
            <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] lg:text-[14px] font-medium text-[#4b5563]">
              <Calendar className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-[#6b7280]" />
              Created
            </div>

            <p className="mt-1.5 text-[12px] md:text-[14px] lg:text-[16px] font-semibold text-[#111827] dark:text-white">
              {formData.createdDate}
            </p>
          </div>

          {/* Workspace */}
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-gray-800/60">
            <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] lg:text-[14px] font-medium text-[#4b5563]">
              <Layers className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-[#6b7280]" />
              Workspace
            </div>

            <p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">
              {formData.workspace}
            </p>
          </div>

          {/* Owner */}
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-gray-800/60">
            <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] lg:text-[14px] font-semibold text-[#4b5563]">
              <User className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-[#6b7280]" />
              Owned
            </div>

            <p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">
              {formData.owner}
            </p>
          </div>

          {/* Members */}
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-gray-800/60">
            <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] lg:text-[14px] font-semibold text-[#4b5563]">
              <Users className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-[#6b7280]" />
              Members
            </div>

            <p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">
              {formData.membersCount}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}