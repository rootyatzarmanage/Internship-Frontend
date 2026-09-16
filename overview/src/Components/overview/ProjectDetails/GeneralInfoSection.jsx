import { CircleHelp } from 'lucide-react'
import Field from './fields/Field'
import ProjectTypeField from './fields/ProjectTypeField'

export default function GeneralInfoSection({ project, onProjectChange }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[16px] font-semibold text-[#555]"><CircleHelp size={15} /> General Information</h3>
      <div className="mt-7 space-y-6">
        <ProjectTypeField
          value={project.type || 'PIM'}
          onChange={(value) => onProjectChange('type', value)}
        />
        <Field label="Description" value={project.description} onChange={(value) => onProjectChange('description', value)} />
      </div>
    </div>
  )
}
