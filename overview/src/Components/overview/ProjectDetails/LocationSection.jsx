import { MapPin } from 'lucide-react'
import Field from './fields/Field'

export default function LocationSection({ project, onProjectChange }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[16px] font-semibold text-[#555]"><MapPin size={15} /> Location &amp; Coordinates</h3>
      <div className="mt-7 space-y-6">
        <Field label="Location" value={project.location} onChange={(value) => onProjectChange('location', value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude" value={project.latitude} type="number" onChange={(value) => onProjectChange('latitude', value)} />
          <Field label="Longitude" value={project.longitude} type="number" onChange={(value) => onProjectChange('longitude', value)} />
        </div>
      </div>
    </div>
  )
}
