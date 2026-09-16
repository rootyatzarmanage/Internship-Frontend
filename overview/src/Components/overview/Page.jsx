import { useState } from 'react'
import ProjectDetails from './ProjectDetails/ProjectDetails'
import ProjectImage from '../../Components/overview/ProjectImage'
import ProjectMap from './ProjectMap'
import ResizableDivider from './ResizableDivider'

export default function Page() {
	const [leftPanelWidth, setLeftPanelWidth] = useState(64)
	const [project, setProject] = useState({ name: 'PSG - Y - Block', type: 'PIM', description: 'PSG-Y-Block Description', location: 'Peelamedu, Coimbatore', latitude: 11.016, longitude: 76.955, status: 'Active', createdDate: '2026-07-27', workspace: 'PSG' })

	const handleProjectChange = (field, value) => {
		setProject((currentProject) => ({ ...currentProject, [field]: field === 'latitude' || field === 'longitude' ? Number(value) : value }))
	}

	const handlePinChange = ({ latitude, longitude }) => {
		setProject((currentProject) => ({ ...currentProject, latitude, longitude }))
	}

	return (
		<div className="overview-panels grid min-h-0 flex-1" style={{ '--left-panel-width': `${leftPanelWidth}fr`, '--right-panel-width': `${100 - leftPanelWidth}fr` }}>
			<section className="min-h-0 min-w-0 overflow-y-auto px-5 py-9 xl:px-9">
				<ProjectDetails project={project} onProjectChange={handleProjectChange} />
			</section>
			<ResizableDivider onResize={setLeftPanelWidth} />
			<section className="overview-right-panel min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-8">
				<div className="grid h-full min-h-0 w-full gap-16" style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}>
					<ProjectImage />
					<ProjectMap pin={project} onPinChange={handlePinChange} />
				</div>
			</section>
		</div>
	)
}
