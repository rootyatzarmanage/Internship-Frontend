import { useEffect, useState } from 'react'
import ProjectDetails from './ProjectDetails'
import ProjectImage from './ProjectImage'
import ProjectMap from './ProjectMap'
import ResizableDivider from './ResizableDivider'

type Project = {
  name: string
  projectType: string
  description: string
  location: string
  latitude: number
  longitude: number
  status: string
  createdDate: string
  workspace: string
  owner: string
  membersCount: number
}

type PanelStyle = React.CSSProperties & {
  '--left-panel-width': string
  '--right-panel-width': string
}

type ProjectChangeField =
  | 'name'
  | 'projectType'
  | 'description'
  | 'location'
  | 'latitude'
  | 'longitude'
  | 'status'
  | 'createdDate'
  | 'workspace'
  | 'owner'
  | 'membersCount'

export default function Page() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(66)

  const [isCompact, setIsCompact] = useState(
    () => window.innerWidth < 1280
  )

  const [project, setProject] = useState<Project>({
    name: 'PSG - Y - Block',
    projectType: 'PIM',
    description: 'PSG-Y-Block Description',
    location: 'Peelamedu, Coimbatore',
    latitude: 11.016,
    longitude: 76.955,
    status: 'Active',
    createdDate: '2026-07-27',
    workspace: 'PSG',
    owner: 'Peter Parker',
    membersCount: 5,
  })

  useEffect(() => {
    const updateLayout = () => {
      setIsCompact(window.innerWidth < 1280)
    }

    window.addEventListener('resize', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

  const handleProjectChange = (
    field: ProjectChangeField,
    value: string | number
  ) => {
    setProject((currentProject) => ({
      ...currentProject,
      [field]:
        field === 'latitude' || field === 'longitude'
          ? Number(value)
          : value,
    }))
  }

  const handlePinChange = ({
    latitude,
    longitude,
  }: {
    latitude: number
    longitude: number
  }) => {
    setProject((currentProject) => ({
      ...currentProject,
      latitude,
      longitude,
    }))
  }

  return (
    <div
	className="overview-panels grid min-h-0 flex-1 overflow-hidden"
	style={{
		'--left-panel-width': `${leftPanelWidth}fr`,
		'--right-panel-width': `${100 - leftPanelWidth}fr`,
		gridTemplateColumns: isCompact
		? 'minmax(0, 1fr)'
		: 'minmax(0, var(--left-panel-width)) 8px minmax(0, var(--right-panel-width))',
		height: '100%',
		minHeight: 0,
	} as PanelStyle}
	>
      <section className="overview-left-column min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-9">
        <ProjectDetails
          project={project}
        />
      </section>

      <ResizableDivider onResize={setLeftPanelWidth} />

      <section className="overview-right-panel min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-8">
        <div
          className="grid h-full min-h-0 w-full gap-16"
          style={{
            gridTemplateRows: 'auto minmax(0, 1fr)',
          }}
        >
          <ProjectImage />

          <ProjectMap
            pin={project}
            onPinChange={handlePinChange}
          />
        </div>
      </section>
    </div>
  )
}