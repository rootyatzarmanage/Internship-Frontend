import { useState } from 'react'
import ProjectDetails from '../cards/ProjectDetails'
import ProjectImage from '../cards/ProjectImage'
import ProjectMap from '../cards/ProjectMap'

export default function Page() {
	const [leftPanelWidth, setLeftPanelWidth] = useState(64)
	const [isDividerDragging, setIsDividerDragging] = useState(false)
	const [project, setProject] = useState({ name: 'PSG - Y - Block', type: 'PIM', description: 'PSG-Y-Block Description', location: 'Peelamedu, Coimbatore', latitude: 11.016, longitude: 76.955, status: 'Active', createdDate: '2026-07-27', workspace: 'PSG' })

	const handleProjectChange = (field, value) => {
		setProject((currentProject) => ({ ...currentProject, [field]: field === 'latitude' || field === 'longitude' ? Number(value) : value }))
	}

	const handlePinChange = ({ latitude, longitude }) => {
		setProject((currentProject) => ({ ...currentProject, latitude, longitude }))
	}

	const handleDividerPointerDown = (event) => {
		const divider = event.currentTarget
		divider.setPointerCapture(event.pointerId)
		setIsDividerDragging(true)
		const content = divider.parentElement

		const handlePointerMove = (moveEvent) => {
			const bounds = content.getBoundingClientRect()
			const nextWidth = ((moveEvent.clientX - bounds.left) / bounds.width) * 100
			setLeftPanelWidth(Math.min(75, Math.max(35, nextWidth)))
		}

		const handlePointerUp = () => {
			if (divider.hasPointerCapture(event.pointerId)) {
				divider.releasePointerCapture(event.pointerId)
			}
			divider.removeEventListener('pointermove', handlePointerMove)
			divider.removeEventListener('pointerup', handlePointerUp)
			divider.removeEventListener('pointercancel', handlePointerUp)
			setIsDividerDragging(false)
		}

		divider.addEventListener('pointermove', handlePointerMove)
		divider.addEventListener('pointerup', handlePointerUp)
		divider.addEventListener('pointercancel', handlePointerUp)
	}

	return (
		<div className="overview-panels grid min-h-0 flex-1" style={{ '--left-panel-width': `${leftPanelWidth}fr`, '--right-panel-width': `${100 - leftPanelWidth}fr` }}>
			<section className="min-h-0 min-w-0 overflow-y-auto px-5 py-9 xl:px-9">
				<ProjectDetails project={project} onProjectChange={handleProjectChange} />
			</section>
			<button type="button" aria-label="Resize project overview panels horizontally" onPointerDown={handleDividerPointerDown} className={`overview-divider group relative z-10 h-full w-2 cursor-col-resize bg-transparent p-0 touch-none${isDividerDragging ? ' is-dragging' : ''}`}>
				<span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#bcbcbc] transition-colors group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" />
			</button>
			<section className="overview-right-panel min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-8">
				<div className="grid h-full min-h-0 w-full gap-16" style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}>
					<ProjectImage />
					<ProjectMap pin={project} onPinChange={handlePinChange} />
				</div>
			</section>
		</div>
	)
}
