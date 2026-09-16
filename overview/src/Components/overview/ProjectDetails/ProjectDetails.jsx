import ProjectSummaryCard from './ProjectSummaryCard'
import GeneralInfoSection from './GeneralInfoSection'
import LocationSection from './LocationSection'
import MetadataSection from './MetadataSection'

export default function ProjectDetails({ project, onProjectChange }) {
  return (
    <div className="w-full space-y-7">
      <ProjectSummaryCard project={project} />

      <section className="rounded-xl border border-[#bbbbbb] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-9">
        <h2 className="text-[30px] font-medium text-[#3d3d3d]">Project details</h2>
        <p className="mt-1 text-[14px] text-[#b9b9b9]">Structured overview and metadata configuration</p>
        <div className="mt-6 border-t border-[#dedede] pt-8">
          <div className="grid gap-10 md:grid-cols-2">
            <GeneralInfoSection project={project} onProjectChange={onProjectChange} />
            <LocationSection project={project} onProjectChange={onProjectChange} />
          </div>
          <MetadataSection />
        </div>
      </section>
    </div>
  )
}
