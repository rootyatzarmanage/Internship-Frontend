import {
    Banknote,
    BriefcaseBusiness,
    CalendarDays,
    Camera,
    Clock3,
    Compass,
    Folder,
    LayoutGrid,
    ScanFace,
    Users,
} from 'lucide-react'

export const navigationGroups = [
    {
        label: 'Project',
        items: [
            { label: 'Analystic', route: '/analytics', icon: LayoutGrid },
            { label: 'Team', route: '/team', icon: Users },
            { label: 'Documents', route: '/documents', icon: Folder },
        ],
    },
    {
        label: 'Define',
        items: [
            { label: 'Scope', route: '/scope', icon: Compass },
            { label: 'Model', route: '/model', icon: ScanFace },
            { label: 'Site Capture', route: '/site-capture', icon: Camera },
        ],
    },
    {
        label: 'Coordinate',
        items: [{ label: 'Meetings', route: '/meetings', icon: CalendarDays }],
    },
    {
        label: 'Plan',
        items: [
            { label: 'Quantities', route: '/quantities', icon: BriefcaseBusiness },
            { label: 'Estimate', route: '/estimate', icon: Banknote },
            { label: 'Programme', route: '/programme', icon: Clock3 },
        ],
    },
]
