import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type V3 = [number, number, number]
type Seg = [V3, V3]
type RGB = [number, number, number]
type Box = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }
type FaceId = 'px' | 'nx' | 'pz' | 'nz' | 'top'

/* ---------- the building ----------
   The model is a set of simple boxes. Every visible face is filled (so the
   back of the building is hidden), shaded by a fixed light, and patterned with
   floor lines and mullions. Faces are depth-sorted every frame (painter's
   algorithm), which is what makes it read as a solid building instead of
   see-through outlines. y is up. */

const FLOOR_H = 0.6
const EDGE = '#00A6F4'
const COPPER = '#D9895A'

const GLASS: RGB = [8, 40, 60]
const GLASS_TOP: RGB = [14, 52, 76]
const SOLID: RGB = [18, 28, 38]
const SOLID_TOP: RGB = [26, 40, 54]
const COPPER_BASE: RGB = [52, 30, 18]

const NORMALS: Record<FaceId, V3> = {
  px: [1, 0, 0],
  nx: [-1, 0, 0],
  pz: [0, 0, 1],
  nz: [0, 0, -1],
  top: [0, 1, 0],
}

const facePts = (b: Box, id: FaceId): V3[] => {
  const { x0, x1, y0, y1, z0, z1 } = b
  switch (id) {
    case 'pz':
      return [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]
    case 'nz':
      return [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]]
    case 'px':
      return [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]]
    case 'nx':
      return [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]
    default:
      return [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]
  }
}

// floor lines and vertical mullions drawn on one side face
const facadeLines = (b: Box, id: Exclude<FaceId, 'top'>, floorH: number, mull: number): Seg[] => {
  const alongX = id === 'pz' || id === 'nz'
  const fixed = id === 'pz' ? b.z1 : id === 'nz' ? b.z0 : id === 'px' ? b.x1 : b.x0
  const a0 = alongX ? b.x0 : b.z0
  const a1 = alongX ? b.x1 : b.z1
  const pt = (a: number, y: number): V3 => (alongX ? [a, y, fixed] : [fixed, y, a])
  const out: Seg[] = []
  const floors = Math.round((b.y1 - b.y0) / floorH)
  for (let k = 1; k < floors; k++) {
    const y = b.y0 + k * floorH
    out.push([pt(a0, y), pt(a1, y)])
  }
  const m = Math.max(1, Math.round((a1 - a0) / mull))
  for (let k = 1; k < m; k++) {
    const a = a0 + ((a1 - a0) * k) / m
    out.push([pt(a, b.y0), pt(a, b.y1)])
  }
  return out
}

type Item = {
  pts: V3[]
  n?: V3 // outward normal; the face is skipped when it points away from the viewer
  base?: RGB // lit fill colour
  fill?: string // fixed fill (overrides base)
  fillOpacity?: number
  stroke: string
  sw: number
  lines?: Seg[]
  lineStroke?: string
  lineOpacity?: number
  lineSw?: number
  bias?: number // negative = drawn later (in front)
}

const ITEMS: Item[] = []

type BoxOpts = {
  faces?: FaceId[]
  base: RGB
  topBase?: RGB
  floorH?: number
  mull?: number
  fins?: FaceId[]
  finMull?: number
}

const ALL_FACES: FaceId[] = ['pz', 'nz', 'px', 'nx', 'top']

function addBox(b: Box, o: BoxOpts) {
  for (const id of o.faces ?? ALL_FACES) {
    const item: Item = {
      pts: facePts(b, id),
      n: NORMALS[id],
      base: id === 'top' ? (o.topBase ?? o.base) : o.base,
      stroke: EDGE,
      sw: 1,
    }
    if (id !== 'top') {
      if (o.fins?.includes(id)) {
        item.base = COPPER_BASE
        item.lines = facadeLines(b, id, 999, o.finMull ?? 0.1)
        item.lineStroke = COPPER
        item.lineOpacity = 0.9
        item.lineSw = 1
      } else if (o.mull !== undefined) {
        item.lines = facadeLines(b, id, o.floorH ?? FLOOR_H, o.mull)
        item.lineStroke = EDGE
        item.lineOpacity = 0.5
        item.lineSw = 0.6
      }
    }
    ITEMS.push(item)
  }
}

const SIDES: FaceId[] = ['pz', 'nz', 'px', 'nx']

const GROUND_FLOOR: Box = { x0: -2.2, x1: 2.2, z0: -1.4, z1: 1.3, y0: 0, y1: 1.1 }
const PODIUM_SLAB: Box = { x0: -2.5, x1: 2.5, z0: -1.7, z1: 1.7, y0: 1.1, y1: 1.2 }
const TOWER: Box = { x0: -1.4, x1: 1.0, z0: -1.1, z1: 1.1, y0: 1.2, y1: 4.8 }
const TOWER_ROOF: Box = { x0: -1.55, x1: 1.15, z0: -1.25, z1: 1.25, y0: 4.8, y1: 4.9 }
const WING: Box = { x0: 1.0, x1: 2.2, z0: -0.9, z1: 0.9, y0: 1.2, y1: 3.0 }
const WING_SLAB: Box = { x0: 1.0, x1: 2.35, z0: -1.05, z1: 1.05, y0: 3.0, y1: 3.1 }
const LOUVER: Box = { x0: -2.2, x1: -1.4, z0: -0.9, z1: 1.3, y0: 1.2, y1: 3.6 }
const CANTILEVER: Box = { x0: -0.4, x1: 1.0, z0: 1.1, z1: 1.7, y0: 2.4, y1: 3.6 }
const PENTHOUSE: Box = { x0: -0.9, x1: 0.6, z0: -0.8, z1: 0.7, y0: 4.9, y1: 5.6 }
const STAIR: Box = { x0: 0.2, x1: 1.0, z0: -1.6, z1: -1.1, y0: 1.2, y1: 5.4 }

addBox(GROUND_FLOOR, { faces: SIDES, base: GLASS, mull: 0.55, floorH: 99 })
addBox(PODIUM_SLAB, { base: SOLID, topBase: SOLID_TOP })
addBox(TOWER, { faces: SIDES, base: GLASS, mull: 0.4 })
addBox(TOWER_ROOF, { base: SOLID, topBase: SOLID_TOP })
addBox(WING, { faces: SIDES, base: GLASS, mull: 0.4 })
addBox(WING_SLAB, { base: SOLID, topBase: SOLID_TOP })
addBox(LOUVER, { base: SOLID, topBase: SOLID_TOP, fins: ['pz', 'nx', 'nz'], finMull: 0.1 })
addBox(CANTILEVER, { base: GLASS, topBase: GLASS_TOP, mull: 0.35 })
addBox(PENTHOUSE, { base: GLASS, topBase: SOLID_TOP, mull: 0.5, floorH: 99 })
addBox(STAIR, { base: SOLID, topBase: SOLID_TOP, mull: 0.2, floorH: 999 })

// highlighted floor on the tower (floor 5)
const BAND: Box = { ...TOWER, y0: TOWER.y0 + FLOOR_H * 4, y1: TOWER.y0 + FLOOR_H * 5 }
for (const id of SIDES) {
  ITEMS.push({
    pts: facePts(BAND, id),
    n: NORMALS[id],
    fill: EDGE,
    fillOpacity: 0.28,
    stroke: 'none',
    sw: 0,
    bias: -0.35,
  })
}

// copper columns under the podium slab
const COL_Y: [number, number] = [0, 1.1]
const colXs = [-2.4, -1.2, 0, 1.2, 2.4]
const colZs = [-0.8, 0.8]
const columnAt = (x: number, z: number) => {
  ITEMS.push({
    pts: [[x, COL_Y[0], z], [x, COL_Y[1], z]],
    fill: 'none',
    stroke: COPPER,
    sw: 2.4,
  })
}
for (const x of colXs) {
  columnAt(x, 1.6)
  columnAt(x, -1.6)
}
for (const z of colZs) {
  columnAt(-2.4, z)
  columnAt(2.4, z)
}

// site plan on the ground, like the drawing sheets under the render
const SITE = { x0: -3.2, x1: 3.2, z0: -2.5, z1: 2.5 }
const GROUND: Seg[] = [
  [[SITE.x0, 0, SITE.z0], [SITE.x1, 0, SITE.z0]],
  [[SITE.x1, 0, SITE.z0], [SITE.x1, 0, SITE.z1]],
  [[SITE.x1, 0, SITE.z1], [SITE.x0, 0, SITE.z1]],
  [[SITE.x0, 0, SITE.z1], [SITE.x0, 0, SITE.z0]],
]
const PLAN: Seg[] = [
  ...[-1.67, -0.83, 0, 0.83, 1.67].map((z) => [[SITE.x0, 0, z], [SITE.x1, 0, z]] as Seg),
  ...[-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((x) => [[x, 0, SITE.z0], [x, 0, SITE.z1]] as Seg),
]

/* ---------- camera ---------- */

const W = 480
const H = 440
const CX = 240
const CY = 210
const SCALE = 38
const FOCAL = 18
const TILT = 0.5
const Y_OFFSET = 2.8
const COS_T = Math.cos(TILT)
const SIN_T = Math.sin(TILT)

const START_ANGLE = 2.5 // radians, so the pinned faces start toward the viewer
const SPEED = 0.15 // radians per second (about 42s per full turn)

// fixed light in camera space (upper left, in front of the model)
const LIGHT: V3 = (() => {
  const v: V3 = [-0.45, 0.65, -0.6]
  const len = Math.hypot(...v)
  return [v[0] / len, v[1] / len, v[2] / len]
})()

const makeCamera = (angle: number) => {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  return {
    point: ([x, y, z]: V3): V3 => {
      const x1 = x * ca + z * sa
      const z1 = -x * sa + z * ca
      const y1 = y - Y_OFFSET
      return [x1, y1 * COS_T + z1 * SIN_T, z1 * COS_T - y1 * SIN_T]
    },
    normal: ([x, y, z]: V3): V3 => {
      const x1 = x * ca + z * sa
      const z1 = -x * sa + z * ca
      return [x1, y * COS_T + z1 * SIN_T, z1 * COS_T - y * SIN_T]
    },
  }
}

const toScreen = ([x, y, z]: V3): [number, number] => {
  const k = FOCAL / (FOCAL + z)
  return [CX + x * SCALE * k, CY - y * SCALE * k]
}

const f = (n: number) => n.toFixed(1)

type Camera = ReturnType<typeof makeCamera>

const segsPath = (segs: Seg[], cam: Camera) =>
  segs
    .map(([p, q]) => {
      const [x1, y1] = toScreen(cam.point(p))
      const [x2, y2] = toScreen(cam.point(q))
      return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`
    })
    .join('')

const rgb = ([r, g, b]: RGB, m: number) => {
  const c = (v: number) => Math.min(255, Math.round(v * m))
  return `rgb(${c(r)},${c(g)},${c(b)})`
}

/* ---------- annotations ---------- */

const CARD_W = 132
const CARD_H = 46
const CARD_X = { left: 6, right: W - CARD_W - 6 }

type Pin = {
  color: string
  p: V3 // point on the building
  n: V3 // outward surface normal (the pin fades when it turns away)
  side: 'left' | 'right'
  y: number
  title: string
  sub: string
}

const PINS: Pin[] = [
  { color: '#5DCAA5', p: [-0.15, 5.6, -0.05], n: [0, 1, 0], side: 'right', y: 30, title: 'Model v12', sub: 'Uploaded now' },
  { color: '#00A6F4', p: [0.3, 3.0, 1.7], n: [0, 0, 1], side: 'right', y: 168, title: 'New task', sub: 'Due Friday' },
  { color: '#F5A524', p: [1.0, 3.9, 0.3], n: [1, 0, 0], side: 'left', y: 262, title: 'Clash found', sub: 'Duct vs beam' },
]

const anchorX = (pin: Pin) => (pin.side === 'right' ? CARD_X.right : CARD_X.left + CARD_W)
const anchorY = (pin: Pin) => pin.y + CARD_H / 2

/* ---------- component ---------- */

export default function WireframeBuilding({ className = '' }: { className?: string }) {
  const planRef = useRef<SVGPathElement>(null)
  const groundRef = useRef<SVGPathElement>(null)
  const faceRefs = useRef<(SVGPathElement | null)[]>([])
  const lineRefs = useRef<(SVGPathElement | null)[]>([])
  const pinFade = useRef<(SVGGElement | null)[]>([])
  const pinHalo = useRef<(SVGCircleElement | null)[]>([])
  const pinDot = useRef<(SVGCircleElement | null)[]>([])
  const leaders = useRef<(SVGLineElement | null)[]>([])
  const cards = useRef<(SVGGElement | null)[]>([])

  useEffect(() => {
    const draw = (angle: number) => {
      const cam = makeCamera(angle)
      planRef.current?.setAttribute('d', segsPath(PLAN, cam))
      groundRef.current?.setAttribute('d', segsPath(GROUND, cam))

      // 1. transform every item, drop faces that point away, remember depth + light
      const visible: { it: Item; cp: V3[]; depth: number; lam: number }[] = []
      for (const it of ITEMS) {
        const cp = it.pts.map(cam.point)
        const cx = cp.reduce((s, p) => s + p[0], 0) / cp.length
        const cy = cp.reduce((s, p) => s + p[1], 0) / cp.length
        const cz = cp.reduce((s, p) => s + p[2], 0) / cp.length
        let lam = 1
        if (it.n) {
          const nc = cam.normal(it.n)
          if (nc[0] * -cx + nc[1] * -cy + nc[2] * (-FOCAL - cz) <= 0) continue
          lam = Math.max(0, nc[0] * LIGHT[0] + nc[1] * LIGHT[1] + nc[2] * LIGHT[2])
        }
        visible.push({ it, cp, depth: cz + (it.bias ?? 0), lam })
      }

      // 2. far to near
      visible.sort((a, b) => b.depth - a.depth)

      // 3. write into the pooled path slots in that order
      for (let i = 0; i < ITEMS.length; i++) {
        const face = faceRefs.current[i]
        const lines = lineRefs.current[i]
        const v = visible[i]
        if (!face || !lines) continue
        if (!v) {
          face.setAttribute('d', '')
          lines.setAttribute('d', '')
          continue
        }
        const { it, cp, lam } = v
        const pts = cp.map((p) => toScreen(p))
        const d = pts.map(([x, y], j) => `${j ? 'L' : 'M'}${f(x)} ${f(y)}`).join('') + (pts.length > 2 ? 'Z' : '')
        face.setAttribute('d', d)
        face.setAttribute('fill', it.fill ?? (it.base ? rgb(it.base, 0.6 + 0.9 * lam) : 'none'))
        face.setAttribute('fill-opacity', String(it.fillOpacity ?? 1))
        face.setAttribute('stroke', it.stroke)
        face.setAttribute('stroke-width', String(it.sw))

        if (it.lines) {
          lines.setAttribute('d', segsPath(it.lines, cam))
          lines.setAttribute('stroke', it.lineStroke ?? EDGE)
          lines.setAttribute('stroke-opacity', String(it.lineOpacity ?? 0.5))
          lines.setAttribute('stroke-width', String(it.lineSw ?? 0.6))
        } else {
          lines.setAttribute('d', '')
        }
      }

      PINS.forEach((pin, i) => {
        const [x, y] = toScreen(cam.point(pin.p))
        const nz = cam.normal(pin.n)[2]
        pinFade.current[i]?.setAttribute('opacity', Math.min(1, Math.max(0, -nz * 3)).toFixed(2))
        for (const el of [pinHalo.current[i], pinDot.current[i]]) {
          el?.setAttribute('cx', f(x))
          el?.setAttribute('cy', f(y))
        }
        leaders.current[i]?.setAttribute('x1', f(x))
        leaders.current[i]?.setAttribute('y1', f(y))
      })
    }

    draw(START_ANGLE)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      cards.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, { y: -5, duration: 2.2 + i * 0.4, delay: i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
      pinHalo.current.forEach((el) => {
        if (!el) return
        gsap.to(el, { attr: { r: 15 }, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
    })

    const t0 = gsap.ticker.time
    const tick = () => draw(START_ANGLE + (gsap.ticker.time - t0) * SPEED)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ctx.revert()
    }
  }, [])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Rotating 3D model of a multi-storey BIM building with task, clash and upload annotations"
    >
      <path ref={planRef} fill="none" stroke="#525252" strokeOpacity={0.45} strokeWidth={0.6} />
      <path ref={groundRef} fill="none" stroke="#525252" strokeWidth={1} strokeDasharray="4 5" />

      {/* pooled slots: the building is redrawn into these, far to near, every frame */}
      {ITEMS.map((_, i) => (
        <g key={i} strokeLinejoin="round" strokeLinecap="round">
          <path ref={(el) => { faceRefs.current[i] = el }} />
          <path ref={(el) => { lineRefs.current[i] = el }} fill="none" />
        </g>
      ))}

      {/* annotations are hidden on small screens, where they would be too small to read */}
      <g className="hidden sm:block">
        {PINS.map((pin, i) => {
          const x = CARD_X[pin.side]
          return (
            <g key={pin.title} ref={(el) => { pinFade.current[i] = el }}>
              <line
                ref={(el) => { leaders.current[i] = el }}
                x2={anchorX(pin)}
                y2={anchorY(pin)}
                stroke="#6f6f6f"
                strokeWidth={0.8}
              />
              <circle ref={(el) => { pinHalo.current[i] = el }} r={9} fill={pin.color} fillOpacity={0.25} />
              <circle ref={(el) => { pinDot.current[i] = el }} r={4.5} fill={pin.color} stroke="#000" strokeWidth={1.5} />
              <g ref={(el) => { cards.current[i] = el }}>
                <rect x={x} y={pin.y} width={CARD_W} height={CARD_H} rx={10} fill="#0f0f0f" stroke="#2b2b2b" />
                <circle cx={x + 14} cy={pin.y + CARD_H / 2} r={4} fill={pin.color} />
                <text x={x + 26} y={pin.y + 20} fontSize={14} fontWeight={600} fill="#ffffff">
                  {pin.title}
                </text>
                <text x={x + 26} y={pin.y + 36} fontSize={12} fill="#9a9a9a">
                  {pin.sub}
                </text>
              </g>
            </g>
          )
        })}
      </g>

      <text x={CX} y={432} textAnchor="middle" fontSize={12} fill="#6f6f6f">
        Tower A · live model
      </text>
    </svg>
  )
}