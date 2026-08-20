// ─── Logo ─────────────────────────────────────────────────────────────────────
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:28px;width:28px;display:block;flex-shrink:0" aria-label="Capacity Planner">
  <rect x="2" y="20" width="7" height="10" rx="1.5" fill="#000C70"/>
  <rect x="12.5" y="12" width="7" height="18" rx="1.5" fill="#000C70"/>
  <rect x="23" y="6" width="7" height="24" rx="1.5" fill="#000C70"/>
  <rect x="2" y="2" width="28" height="2.5" rx="1.25" fill="#000C70" opacity="0.18"/>
</svg>`

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  surfaceAlt: '#F7F8FC',
  surfaceHover: '#F0F2F8',
  border: '#E2E5EE',
  borderLight: '#ECEEF4',
  navy900: '#000C70',
  navy700: '#0055BD',
  navy500: '#24A6FF',
  navy100: '#ADDEFF',
  navy50:  '#E5F5FF',
  magenta900: '#73004F',
  magenta700: '#B00079',
  magenta500: '#E00099',
  magenta100: '#FFE5F7',
  textPrimary:   '#1A1F36',
  textSecondary: '#6B7394',
  textMuted:     '#9CA3BF',
  shadow: 'rgba(0, 12, 112, 0.05)',
}

const WEEK_IDS  = ['w0','w1','w2','w3','w4','w5','w6','w7']
const PLANNER_START = (() => { const d = new Date(2025,0,6); d.setHours(0,0,0,0); return d })()
const HOUR_HEAT_MAX  = 30
const STORAGE_VERSION = 'v7-demo'

// ─── Seed data ─────────────────────────────────────────────────────────────────
const ALL_ZERO = Object.fromEntries(WEEK_IDS.map(w => [w, 0]))
const ALL_40   = Object.fromEntries(WEEK_IDS.map(w => [w, 40]))

// Week indices: w0=Jan6, w1=Jan13, w2=Jan20, w3=Jan27, w4=Feb3, w5=Feb10, w6=Feb17, w7=Feb24
// Totals: Alex [40,40,48↑,40,40,32↓,40,40] · Sam [40,44↑,40,40,28↓,40,40,40] · Jordan [40,40,40,32↓,40,40,48↑,40] · Morgan [40,40,36↓,40,40,48↑,40,40]
const SEED_DESIGNERS = [
  {
    id: 'd1', name: 'Alex Rivera', capacity: { ...ALL_40 },
    projects: [
      { id: 'p1', name: 'Brand Refresh',        hours: { w0:20, w1:20, w2:20, w3:16, w4:16, w5:16, w6:16, w7:20 } },
      { id: 'p2', name: 'Mobile App v2',        hours: { w0:12, w1:12, w2:20, w3:16, w4:16, w5:8,  w6:16, w7:12 } },
      { id: 'p3', name: 'Design System Audit',  hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
    ],
  },
  {
    id: 'd2', name: 'Sam Chen', capacity: { ...ALL_40 },
    projects: [
      { id: 'p4', name: 'Checkout Redesign',  hours: { w0:16, w1:20, w2:16, w3:16, w4:12, w5:16, w6:16, w7:20 } },
      { id: 'p5', name: 'Component Library',  hours: { w0:16, w1:16, w2:16, w3:16, w4:8,  w5:16, w6:16, w7:12 } },
      { id: 'p6', name: 'User Research',      hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
    ],
  },
  {
    id: 'd3', name: 'Jordan Kim', capacity: { ...ALL_40 },
    projects: [
      { id: 'p7', name: 'Onboarding Flow',      hours: { w0:16, w1:20, w2:16, w3:12, w4:16, w5:16, w6:20, w7:16 } },
      { id: 'p8', name: 'Dashboard Redesign',   hours: { w0:16, w1:12, w2:16, w3:12, w4:16, w5:16, w6:20, w7:16 } },
      { id: 'p9', name: 'Marketing Site',       hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
    ],
  },
  {
    id: 'd4', name: 'Morgan Taylor', capacity: { ...ALL_40 },
    projects: [
      { id: 'p10', name: 'Email Templates',      hours: { w0:16, w1:16, w2:16, w3:16, w4:16, w5:20, w6:16, w7:16 } },
      { id: 'p11', name: 'Settings Revamp',      hours: { w0:16, w1:16, w2:12, w3:16, w4:16, w5:20, w6:16, w7:16 } },
      { id: 'p12', name: 'Accessibility Audit',  hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
    ],
  },
]

// ─── Utilities ─────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2,9) }

function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0,0,0,0)
  return d
}

function getWeeks() {
  const origin = PLANNER_START
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return WEEK_IDS.map((id, i) => {
    const start = new Date(origin); start.setDate(origin.getDate() + i * 7)
    const end   = new Date(start);  end.setDate(start.getDate() + 4)
    const prev  = i > 0 ? new Date(origin) : null
    if (prev) prev.setDate(origin.getDate() + (i - 1) * 7)
    const isMonthBoundary = i > 0 && prev.getMonth() !== start.getMonth()
    return {
      id,
      startLabel: fmt(start),
      endLabel:   fmt(end),
      isCurrentWeek: false,
      isMonthBoundary,
      monthLabel:    start.toLocaleDateString('en-US', { month: 'long' }),
      showMonthLabel: i === 0 || isMonthBoundary,
    }
  })
}

function getMonthGroups(weeks) {
  const groups = []
  weeks.forEach(w => {
    if (w.showMonthLabel) groups.push({ monthLabel: w.monthLabel, weeks: [w] })
    else groups[groups.length - 1].weeks.push(w)
  })
  return groups
}

function migrateDesigners(designers) {
  return designers.map(d => {
    const known = WEEK_IDS.filter(w => d.capacity[w] !== undefined)
    const defCap = known.length ? d.capacity[known[known.length - 1]] : 40
    const capacity = { ...d.capacity }
    WEEK_IDS.forEach(w => { if (capacity[w] === undefined) capacity[w] = defCap })
    const projects = d.projects.map(p => {
      const hours = { ...p.hours }
      WEEK_IDS.forEach(w => { if (hours[w] === undefined) hours[w] = 0 })
      return { ...p, hours }
    })
    return { ...d, capacity, projects }
  })
}

// ─── Color helpers ─────────────────────────────────────────────────────────────
function sRGBtoLinear(c) {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function relativeLuminance(hex) {
  return 0.2126 * sRGBtoLinear(parseInt(hex.slice(1,3),16))
       + 0.7152 * sRGBtoLinear(parseInt(hex.slice(3,5),16))
       + 0.0722 * sRGBtoLinear(parseInt(hex.slice(5,7),16))
}
function wcagTextColor(bgHex) {
  const L = relativeLuminance(bgHex)
  return (1.05 / (L + 0.05)) >= ((L + 0.05) / (relativeLuminance('#1A1F36') + 0.05))
    ? '#FFFFFF' : C.textPrimary
}
function interpolateHex(a, b, t) {
  const r1=parseInt(a.slice(1,3),16), g1=parseInt(a.slice(3,5),16), b1=parseInt(a.slice(5,7),16)
  const r2=parseInt(b.slice(1,3),16), g2=parseInt(b.slice(3,5),16), b2=parseInt(b.slice(5,7),16)
  const r=Math.round(r1+(r2-r1)*t), g=Math.round(g1+(g2-g1)*t), bv=Math.round(b1+(b2-b1)*t)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bv.toString(16).padStart(2,'0')}`
}
function getHourHeat(hours) {
  if (!hours || hours <= 0) return { bg: null, fg: C.textMuted }
  const t  = Math.min(hours, HOUR_HEAT_MAX) / HOUR_HEAT_MAX
  const bg = interpolateHex(C.magenta100, C.magenta900, t)
  return { bg, fg: wcagTextColor(bg) }
}

// ─── HTML escaping ─────────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// ─── State ─────────────────────────────────────────────────────────────────────
const state = {
  designers: [],
  expandedSet: new Set(),
  confirm: null,
  addDesignerOpen: false,
}

let draggingIndex = null  // managed via CSS classes, not state

function loadState() {
  try {
    const version = localStorage.getItem('cp_version')
    if (version !== STORAGE_VERSION) {
      localStorage.clear()
      localStorage.setItem('cp_version', STORAGE_VERSION)
    }
    const saved = localStorage.getItem('cp_designers')
    state.designers = migrateDesigners(saved ? JSON.parse(saved) : SEED_DESIGNERS)
  } catch {
    state.designers = JSON.parse(JSON.stringify(SEED_DESIGNERS))
  }
  state.expandedSet = new Set(state.designers.map(d => d.id))
}

function saveDesigners() {
  try {
    localStorage.setItem('cp_designers', JSON.stringify(state.designers))
  } catch {}
}

// ─── SVG icons ─────────────────────────────────────────────────────────────────
function iconChevron(open) {
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="transform:${open?'rotate(90deg)':'rotate(0deg)'};transition:transform 0.2s;flex-shrink:0;display:block">
    <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}
function iconPencil(s=13) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}
function iconTrash(s=14) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M6 6.5v4M8 6.5v4M3 3.5l.7 7a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5l.7-7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}
function iconPlus(s=14) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
}
function iconCSV(s=14) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M1.5 5.5h11M1.5 8.5h11M5.5 1.5v11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`
}
function iconDownload(s=14) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5v7M4.5 6.5L7 9l2.5-2.5M2 11v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}
function iconGrip(s=14) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="currentColor">
    <circle cx="4.5" cy="3.5" r="1.1"/><circle cx="9.5" cy="3.5" r="1.1"/>
    <circle cx="4.5" cy="7"   r="1.1"/><circle cx="9.5" cy="7"   r="1.1"/>
    <circle cx="4.5" cy="10.5" r="1.1"/><circle cx="9.5" cy="10.5" r="1.1"/>
  </svg>`
}

// ─── Render: shared components ─────────────────────────────────────────────────
function renderTotalCell(value) {
  return `<div style="width:72px;min-width:72px;display:flex;align-items:center;justify-content:center;border-right:1px solid ${C.border}">
    <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${value>0?C.navy900:C.textMuted}">${value>0?`${value}h`:'–'}</span>
  </div>`
}

function renderHourCell(value, designerId, weekId, projectId, heatmap) {
  const heat = heatmap ? getHourHeat(value) : null
  const bg   = heat?.bg ?? 'transparent'
  const fg   = heat ? heat.fg : (value > 0 ? C.textPrimary : C.textMuted)
  const editType = projectId ? 'hours' : 'capacity'
  const projAttr = projectId ? ` data-project-id="${projectId}"` : ''
  const cls  = `hour-cell${projectId ? '' : ' cap-cell'}`

  return `<div class="${cls}" data-edit="${editType}" data-designer-id="${designerId}" data-week-id="${weekId}"${projAttr} data-edit-value="${value}" style="background:${bg}">
    ${value === 0
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:${C.textMuted}">–</span>`
      : `<span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:400;color:${fg}">${value}</span>`
    }
  </div>`
}

function renderUtilCell(booked, capacity, isCurrentWeek) {
  const pct = capacity > 0 ? Math.round((booked / capacity) * 100) : 0
  const overflow = pct > 100
  return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px 8px;border-radius:8px;background:${isCurrentWeek?C.navy50:'transparent'}">
    <span style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:${C.textSecondary};line-height:1">${capacity===0?'–':`${pct}%`}</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${C.textSecondary};line-height:1">${booked}/${capacity}h</span>
    <div style="width:100%;margin-top:3px">
      <div style="width:100%;height:4px;border-radius:2px;background:${C.borderLight};overflow:hidden">
        <div style="width:${Math.min(pct,100)}%;height:100%;background:${C.textSecondary};border-radius:2px;transition:width 0.3s"></div>
      </div>
      ${overflow ? `<div style="width:${Math.min(pct-100,100)}%;height:2px;background:${C.magenta500};border-radius:2px;margin-top:2px"></div>` : ''}
    </div>
  </div>`
}

// ─── Render: monthly overview ──────────────────────────────────────────────────
function renderMonthCard(monthLabel, weeks, designers) {
  const totalCapacity  = designers.reduce((s, d) => s + weeks.reduce((ss, w) => ss + (d.capacity[w.id]??0), 0), 0)
  const totalAllocated = designers.reduce((s, d) => s + d.projects.reduce((ps, p) => ps + weeks.reduce((ss, w) => ss + (p.hours[w.id]??0), 0), 0), 0)
  const pct = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0

  return `<div style="grid-column:span ${weeks.length};background:${C.bg};border:1px solid ${C.border};border-radius:12px;box-shadow:0 2px 8px ${C.shadow};padding:24px;display:flex;flex-direction:column;gap:16px">
    <div style="display:flex;align-items:baseline;justify-content:space-between">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.textMuted}">${monthLabel}</span>
      <span style="font-size:11px;color:${C.textMuted}">${weeks.length} week${weeks.length!==1?'s':''}</span>
    </div>
    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;color:${C.navy900};line-height:1">${totalAllocated}h</div>
      <div style="font-size:12px;color:${C.textSecondary};margin-top:4px">of ${totalCapacity}h available</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <div style="flex:1;height:6px;background:${C.borderLight};border-radius:3px;overflow:hidden">
        <div style="width:${Math.min(pct,100)}%;height:100%;background:${C.textSecondary};border-radius:3px;transition:width 0.3s"></div>
      </div>
      <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${C.textSecondary};min-width:36px;text-align:right">${totalCapacity>0?`${pct}%`:'–'}</span>
    </div>
  </div>`
}

function renderMonthlySection(weeks, designers) {
  const groups = getMonthGroups(weeks)
  return `<div style="display:flex;gap:10px;padding:0 13px;margin-bottom:16px">
    <div style="width:362px;min-width:362px;flex-shrink:0;display:flex;align-items:center">
      <span style="font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textMuted}">Monthly Overview</span>
    </div>
    <div style="flex:1;display:grid;grid-template-columns:repeat(${weeks.length},1fr);gap:10px">
      ${groups.map(g => renderMonthCard(g.monthLabel, g.weeks, designers)).join('')}
    </div>
  </div>`
}

// ─── Render: week column headers ───────────────────────────────────────────────
function renderWeekHeader(week) {
  const monthBorderStyle = week.isMonthBoundary ? `border-left:2px solid ${C.border};padding-left:8px` : ''
  return `<div style="flex:1;min-width:58px;display:flex;flex-direction:column;${monthBorderStyle}">
    <div style="height:20px;display:flex;align-items:center">
      ${week.showMonthLabel ? `<span style="font-size:10px;font-weight:700;letter-spacing:1.2px;color:${C.textMuted};text-transform:uppercase">${week.monthLabel}</span>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:8px;gap:2px">
      ${week.isCurrentWeek ? `<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:${C.navy700};background:${C.navy50};padding:2px 6px;border-radius:4px;text-transform:uppercase">This Week</span>` : ''}
      <span style="font-size:12px;font-weight:500;color:${week.isCurrentWeek?C.navy900:C.textSecondary};text-align:center">
        <span style="display:block">${week.startLabel} –</span>
        <span style="display:block">${week.endLabel}</span>
      </span>
    </div>
  </div>`
}

function renderWeekHeaders(weeks) {
  return `<div class="week-headers-sticky">
    <div style="display:flex;align-items:flex-end;gap:10px;padding:0 13px 8px">
      <div style="width:280px;min-width:280px"></div>
      <div style="width:72px;min-width:72px;display:flex;flex-direction:column;border-right:1px solid ${C.border}">
        <div style="height:20px"></div>
        <div style="display:flex;align-items:center;justify-content:center">
          <span style="font-size:12px;font-weight:600;color:${C.textSecondary}">Total</span>
        </div>
      </div>
      ${weeks.map(w => renderWeekHeader(w)).join('')}
    </div>
  </div>`
}

// ─── Render: project row ───────────────────────────────────────────────────────
function renderProjectRow(project, weeks, totalCapacity, designerId) {
  const projectTotal = weeks.reduce((s, w) => s + (project.hours[w.id]??0), 0)
  const pct = totalCapacity > 0 ? (projectTotal / totalCapacity) * 100 : 0

  return `<div class="project-row">
    <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:5px;padding-left:32px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;min-width:0">
          <span class="editable-text" data-edit="project-name" data-designer-id="${designerId}" data-project-id="${project.id}"
            style="font-size:13px;font-weight:500;color:${C.textPrimary};display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text"
          >${esc(project.name)}</span>
        </div>
        <button class="icon-btn trash-btn" data-action="remove-project" data-designer-id="${designerId}" data-project-id="${project.id}" title="Remove project" style="color:${C.textMuted}">
          ${iconTrash(13)}
        </button>
      </div>
      <div style="padding-left:16px;padding-right:2px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;height:3px;background:${C.borderLight};border-radius:2px;overflow:hidden">
            <div style="width:${Math.min(pct,100)}%;height:100%;background:${C.textSecondary};border-radius:2px;opacity:0.65;transition:width 0.3s"></div>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;color:${pct>0?C.textSecondary:C.textMuted};white-space:nowrap;min-width:28px;text-align:right">${pct>0?`${Math.round(pct)}%`:'–'}</span>
        </div>
      </div>
    </div>
    ${renderTotalCell(projectTotal)}
    ${weeks.map(w => `
      <div style="flex:1;min-width:58px;display:flex;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
        ${renderHourCell(project.hours[w.id]??0, designerId, w.id, project.id, true)}
      </div>`).join('')}
  </div>`
}

// ─── Render: designer card ─────────────────────────────────────────────────────
function renderDesignerCard(designer, index, weeks) {
  const expanded      = state.expandedSet.has(designer.id)
  const totalBooked   = weeks.reduce((s, w) => s + designer.projects.reduce((ps, p) => ps + (p.hours[w.id]??0), 0), 0)
  const totalCapacity = weeks.reduce((s, w) => s + (designer.capacity[w.id]??0), 0)
  const pct           = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0

  return `<div class="designer-card-wrapper" data-designer-index="${index}">
    <div class="designer-card" data-designer-id="${designer.id}">

      <div class="designer-header${expanded?'':' collapsed'}" data-action="toggle-expand" data-designer-id="${designer.id}">
        <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:6px">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="grip-icon" draggable="true" data-drag-handle data-designer-index="${index}" title="Drag to reorder">
              ${iconGrip(13)}
            </span>
            <span style="color:${C.textSecondary};line-height:0">${iconChevron(expanded)}</span>
            <div style="flex:1;min-width:0">
              <span class="editable-text" data-edit="designer-name" data-designer-id="${designer.id}"
                style="font-size:15px;font-weight:600;color:${C.navy900};cursor:text;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
              >${esc(designer.name)}</span>
            </div>
            <span class="hover-reveal" style="color:${C.textMuted};pointer-events:none;line-height:0">${iconPencil()}</span>
            <span style="font-size:11px;color:${C.textMuted};flex-shrink:0;white-space:nowrap">${designer.projects.length} project${designer.projects.length!==1?'s':''}</span>
            <button class="icon-btn hover-reveal" data-action="remove-designer" data-designer-id="${designer.id}" title="Remove designer" style="color:${C.textMuted}">
              ${iconTrash(14)}
            </button>
          </div>
          <div style="padding-left:35px;padding-right:2px">
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${C.textSecondary}">${totalBooked}h <span style="color:${C.textMuted}">/ ${totalCapacity}h</span></span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:${C.textSecondary}">${totalCapacity>0?`${pct}%`:'–'}</span>
            </div>
            <div style="height:4px;background:${C.borderLight};border-radius:2px;overflow:hidden">
              <div style="width:${Math.min(pct,100)}%;height:100%;background:${C.textSecondary};border-radius:2px;transition:width 0.3s"></div>
            </div>
          </div>
        </div>
        ${renderTotalCell(totalBooked)}
        ${weeks.map(w => {
          const booked = designer.projects.reduce((s, p) => s + (p.hours[w.id]??0), 0)
          const cap    = designer.capacity[w.id] ?? 0
          return `<div style="flex:1;min-width:58px;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
            ${renderUtilCell(booked, cap, w.isCurrentWeek)}
          </div>`
        }).join('')}
      </div>

      ${expanded ? `
        <div style="display:flex;align-items:center;gap:10px;padding:4px 12px;min-height:44px;background:${C.surfaceAlt};border-bottom:1px solid ${C.borderLight}">
          <div style="width:280px;min-width:280px;padding-left:26px">
            <span style="font-size:12px;font-weight:600;color:${C.textSecondary};letter-spacing:0.3px">Available Hours</span>
          </div>
          ${renderTotalCell(weeks.reduce((s, w) => s + (designer.capacity[w.id]??0), 0))}
          ${weeks.map(w => `
            <div style="flex:1;min-width:58px;display:flex;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
              ${renderHourCell(designer.capacity[w.id]??0, designer.id, w.id, null, false)}
            </div>`).join('')}
        </div>
        ${designer.projects.map(p => renderProjectRow(p, weeks, totalCapacity, designer.id)).join('')}
        <div style="padding:7px 16px 9px 52px">
          <button class="add-proj-btn" data-action="add-project" data-designer-id="${designer.id}">
            ${iconPlus(12)} Add project
          </button>
        </div>
      ` : ''}

    </div>
  </div>`
}

// ─── Render: totals row ────────────────────────────────────────────────────────
function renderTotalsRow(designers, weeks) {
  const weekTotal = w => designers.reduce((s, d) => s + d.projects.reduce((ps, p) => ps + (p.hours[w]??0), 0), 0)
  const grand     = weeks.reduce((s, w) => s + weekTotal(w.id), 0)

  return `<div style="margin-top:32px">
    <div style="font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textMuted};margin-bottom:10px;padding-left:2px">Total Hours</div>
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;box-shadow:0 2px 8px ${C.shadow};overflow:hidden;display:flex;align-items:center;gap:10px;padding:0 12px;min-height:52px">
      <div style="width:280px;min-width:280px;padding-left:4px;display:flex;align-items:center;gap:8px">
        <span style="font-size:13px;font-weight:700;color:${C.textSecondary}">All Designers</span>
      </div>
      ${renderTotalCell(grand)}
      ${weeks.map(w => {
        const total = weekTotal(w.id)
        return `<div style="flex:1;min-width:58px;display:flex;align-items:center;justify-content:center;padding:${w.isMonthBoundary?'8px 4px 8px 6px':'8px 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:${total>0?700:400};color:${total>0?C.navy900:C.textMuted};background:${w.isCurrentWeek&&total>0?C.navy50:'transparent'};border-radius:6px;padding:${w.isCurrentWeek&&total>0?'2px 8px':'2px 0'}">
            ${total>0?`${total}h`:'–'}
          </span>
        </div>`
      }).join('')}
    </div>
  </div>`
}

// ─── Render: add designer ──────────────────────────────────────────────────────
function renderAddDesigner() {
  if (!state.addDesignerOpen) {
    return `<button id="add-designer-btn" data-action="open-add-designer">
      ${iconPlus(13)} Add Designer
    </button>`
  }
  return `<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:${C.surfaceAlt};border:1px solid ${C.border};border-radius:12px">
    <input id="add-designer-input" class="add-designer-input" placeholder="Designer name" autocomplete="off" />
    <button data-action="submit-add-designer" style="font-family:'Jost',sans-serif;font-size:13px;font-weight:600;color:#fff;background:${C.navy900};border:none;border-radius:6px;padding:6px 14px;cursor:pointer">Add</button>
    <button data-action="cancel-add-designer" style="font-family:'Jost',sans-serif;font-size:13px;font-weight:500;color:${C.textSecondary};background:none;border:1px solid ${C.border};border-radius:6px;padding:6px 10px;cursor:pointer">Cancel</button>
  </div>`
}

// ─── Render: nav ──────────────────────────────────────────────────────────────
function renderNav() {
  return `<div id="nav">
    <div class="nav-inner">
      <div style="display:flex;align-items:center;gap:16px">
        ${LOGO_SVG}
        <div style="width:1px;height:24px;background:${C.border}"></div>
        <span style="font-size:18px;font-weight:600;color:${C.navy900};line-height:1">Designer Capacity Planner</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <button class="export-btn" data-action="export-csv">
          ${iconCSV(13)} <span>Export CSV</span>
        </button>
        <button class="export-btn" data-action="export-png">
          ${iconDownload(13)} <span>Export PNG</span>
        </button>
      </div>
    </div>
  </div>`
}

// ─── Render: confirm modal ─────────────────────────────────────────────────────
function renderConfirmModal(confirm) {
  return `<div id="modal-dialog" style="background:${C.bg};border-radius:14px;padding:28px 28px 22px;box-shadow:0 12px 40px rgba(0,12,112,0.16);border:1px solid ${C.border};width:360px;max-width:calc(100vw - 48px)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:32px;height:32px;border-radius:8px;flex-shrink:0;background:${C.magenta100};display:flex;align-items:center;justify-content:center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 6v4M8 11.5v.5" stroke="${C.magenta700}" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M6.8 2.3L1.2 12a1.4 1.4 0 0 0 1.2 2h11.2a1.4 1.4 0 0 0 1.2-2L9.2 2.3a1.4 1.4 0 0 0-2.4 0z" stroke="${C.magenta700}" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
      </div>
      <span style="font-size:16px;font-weight:700;color:${C.navy900}">${esc(confirm.title)}</span>
    </div>
    <p style="font-size:13px;color:${C.textSecondary};line-height:1.6;margin:0 0 22px;padding-left:42px">${esc(confirm.message)}</p>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button data-action="confirm-cancel" style="font-family:'Jost',sans-serif;font-size:13px;font-weight:500;color:${C.textSecondary};background:none;border:1px solid ${C.border};border-radius:7px;padding:7px 18px;cursor:pointer">Cancel</button>
      <button data-action="confirm-ok" style="font-family:'Jost',sans-serif;font-size:13px;font-weight:600;color:#fff;background:${C.magenta700};border:none;border-radius:7px;padding:7px 18px;cursor:pointer">Delete</button>
    </div>
  </div>`
}

// ─── Full app render ───────────────────────────────────────────────────────────
function renderApp() {
  const weeks     = getWeeks()
  const designers = state.designers
  return `
    ${renderNav()}
    <div id="scroll-container">
      <div class="content">
        ${renderMonthlySection(weeks, designers)}
        ${renderWeekHeaders(weeks)}
        <div style="display:flex;flex-direction:column;gap:10px">
          ${designers.map((d, i) => renderDesignerCard(d, i, weeks)).join('')}
          ${renderAddDesigner()}
        </div>
        ${renderTotalsRow(designers, weeks)}
      </div>
    </div>
  `
}

// ─── DOM update ───────────────────────────────────────────────────────────────
function render() {
  const scroller = document.getElementById('scroll-container')
  const scrollTop  = scroller?.scrollTop  ?? 0
  const scrollLeft = scroller?.scrollLeft ?? 0

  document.getElementById('app').innerHTML = renderApp()

  const newScroller = document.getElementById('scroll-container')
  if (newScroller) {
    newScroller.scrollTop  = scrollTop
    newScroller.scrollLeft = scrollLeft
  }

  updateNavHeight()
  if (state.confirm) showModal()
  if (state.addDesignerOpen) {
    document.getElementById('add-designer-input')?.focus()
  }
}

function showModal() {
  const root = document.getElementById('modal-root')
  root.innerHTML = renderConfirmModal(state.confirm)
  root.classList.add('active')
  root.querySelector('[data-action="confirm-ok"]')?.focus()
}

function hideModal() {
  const root = document.getElementById('modal-root')
  root.innerHTML = ''
  root.classList.remove('active')
}

function updateNavHeight() {
  const nav = document.getElementById('nav')
  if (nav) document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px')
}

// ─── Inline text editing ───────────────────────────────────────────────────────
function startTextEdit(span) {
  if (span.querySelector('input')) return
  const current = span.textContent.trim()
  const input   = document.createElement('input')
  input.className = 'inline-text-input'
  input.value     = current
  span.innerHTML  = ''
  span.appendChild(input)
  input.focus()
  input.select()

  function commit() {
    const trimmed = input.value.trim()
    if (!trimmed) { render(); return }
    const type     = span.dataset.edit
    const designer = state.designers.find(d => d.id === span.dataset.designerId)
    if (!designer) return
    if (type === 'designer-name') {
      designer.name = trimmed
    } else if (type === 'project-name') {
      const p = designer.projects.find(p => p.id === span.dataset.projectId)
      if (p) p.name = trimmed
    }
    saveDesigners()
    render()
  }

  input.addEventListener('blur',    commit)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur() }
    if (e.key === 'Escape') { e.stopPropagation(); render() }
  })
}

// ─── Inline hour editing ───────────────────────────────────────────────────────
function startHourEdit(cell) {
  if (cell.querySelector('input')) return
  const current = parseFloat(cell.dataset.editValue) || 0
  const heat    = getHourHeat(current)
  const fg      = heat?.fg ?? C.textPrimary
  const input   = document.createElement('input')
  input.className   = 'hour-input'
  input.value       = current === 0 ? '' : String(current)
  input.style.color = fg
  cell.innerHTML    = ''
  cell.appendChild(input)
  cell.classList.add('editing')
  input.focus()
  input.select()

  function commit() {
    const raw  = parseFloat(input.value)
    const val  = isNaN(raw) || raw < 0 ? 0 : raw
    const type = cell.dataset.edit
    const designer = state.designers.find(d => d.id === cell.dataset.designerId)
    if (!designer) return
    if (type === 'capacity') {
      designer.capacity[cell.dataset.weekId] = val
    } else if (type === 'hours') {
      const p = designer.projects.find(p => p.id === cell.dataset.projectId)
      if (p) p.hours[cell.dataset.weekId] = val
    }
    saveDesigners()
    render()
  }

  input.addEventListener('blur',    commit)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur() }
    if (e.key === 'Escape') { e.stopPropagation(); render() }
  })
}

// ─── Click handler ─────────────────────────────────────────────────────────────
function handleClick(e) {
  // Drag handle — do nothing on click
  if (e.target.closest('[data-drag-handle]')) { e.stopPropagation(); return }

  // Editable text spans
  const editSpan = e.target.closest('.editable-text')
  if (editSpan) { startTextEdit(editSpan); return }

  // Hour / capacity cells
  const hourCell = e.target.closest('.hour-cell')
  if (hourCell && !hourCell.querySelector('input')) { startHourEdit(hourCell); return }

  // Named actions
  const btn    = e.target.closest('[data-action]')
  if (!btn) return
  const action = btn.dataset.action

  if (action === 'toggle-expand') {
    // Only fire if the click wasn't intercepted by an inner handler above.
    // (Editable spans / hour cells / drag handles all return early.)
    const id = btn.dataset.designerId
    if (state.expandedSet.has(id)) state.expandedSet.delete(id)
    else state.expandedSet.add(id)
    render()
    return
  }

  if (action === 'add-project') {
    const designer = state.designers.find(d => d.id === btn.dataset.designerId)
    if (designer) {
      designer.projects.push({ id: uid(), name: 'New Project', hours: Object.fromEntries(WEEK_IDS.map(w => [w,0])) })
      saveDesigners(); render()
    }
    return
  }

  if (action === 'remove-project') {
    const designer = state.designers.find(d => d.id === btn.dataset.designerId)
    const project  = designer?.projects.find(p => p.id === btn.dataset.projectId)
    if (designer && project) {
      state.confirm = {
        title: 'Remove project',
        message: `Remove "${project.name}" from ${designer.name}'s workload? This can't be undone.`,
        onConfirm: () => {
          designer.projects = designer.projects.filter(p => p.id !== project.id)
          saveDesigners(); state.confirm = null; hideModal(); render()
        },
      }
      showModal()
    }
    return
  }

  if (action === 'remove-designer') {
    e.stopPropagation()
    const designer = state.designers.find(d => d.id === btn.dataset.designerId)
    if (designer) {
      state.confirm = {
        title: 'Remove designer',
        message: `Remove ${designer.name} and all ${designer.projects.length} of their project${designer.projects.length!==1?'s':''}? This can't be undone.`,
        onConfirm: () => {
          state.designers = state.designers.filter(d => d.id !== designer.id)
          state.expandedSet.delete(designer.id)
          saveDesigners(); state.confirm = null; hideModal(); render()
        },
      }
      showModal()
    }
    return
  }

  if (action === 'export-csv')           { exportToCSV(); return }
  if (action === 'export-png')           { exportToPNG(); return }
  if (action === 'open-add-designer')    { state.addDesignerOpen = true;  render(); return }
  if (action === 'cancel-add-designer')  { state.addDesignerOpen = false; render(); return }
  if (action === 'submit-add-designer')  { submitNewDesigner(document.getElementById('add-designer-input')?.value ?? ''); return }
}

function submitNewDesigner(name) {
  const trimmed = name.trim()
  if (!trimmed) return
  const d = { id: uid(), name: trimmed, capacity: Object.fromEntries(WEEK_IDS.map(w=>[w,40])), projects: [] }
  state.designers.push(d)
  state.expandedSet.add(d.id)
  state.addDesignerOpen = false
  saveDesigners()
  render()
}

// ─── Modal click handler ───────────────────────────────────────────────────────
function handleModalClick(e) {
  const action = e.target.closest('[data-action]')?.dataset.action
  if (action === 'confirm-ok') {
    const fn = state.confirm?.onConfirm
    fn?.()
  } else if (action === 'confirm-cancel' || !e.target.closest('#modal-dialog')) {
    state.confirm = null
    hideModal()
  }
}

// ─── Drag and drop ─────────────────────────────────────────────────────────────
function handleDragStart(e) {
  const handle = e.target.closest('[data-drag-handle]')
  if (!handle) { e.preventDefault(); return }
  draggingIndex = parseInt(handle.dataset.designerIndex)
  handle.closest('.designer-card-wrapper').classList.add('is-dragging')
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(draggingIndex))
}

function handleDragEnd() {
  draggingIndex = null
  document.querySelectorAll('.drag-over').forEach(el  => el.classList.remove('drag-over'))
  document.querySelectorAll('.is-dragging').forEach(el => el.classList.remove('is-dragging'))
}

function handleDragOver(e) {
  const zone = e.target.closest('.designer-card-wrapper')
  if (!zone) return
  e.preventDefault()
  const toIdx = parseInt(zone.dataset.designerIndex)
  if (toIdx !== draggingIndex) {
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'))
    zone.classList.add('drag-over')
  }
}

function handleDragLeave(e) {
  const zone = e.target.closest('.designer-card-wrapper')
  if (zone && !zone.contains(e.relatedTarget)) zone.classList.remove('drag-over')
}

function handleDrop(e) {
  e.preventDefault()
  const zone = e.target.closest('.designer-card-wrapper')
  if (!zone || draggingIndex === null) return
  const toIdx = parseInt(zone.dataset.designerIndex)
  if (toIdx !== draggingIndex) {
    const arr = [...state.designers]
    const [moved] = arr.splice(draggingIndex, 1)
    arr.splice(toIdx, 0, moved)
    state.designers = arr
    saveDesigners()
  }
  draggingIndex = null
  render()
}

// ─── CSV export ───────────────────────────────────────────────────────────────
function exportToCSV() {
  const weeks     = getWeeks()
  const designers = state.designers

  // Wrap values that contain commas, quotes, or newlines
  const cell = v => {
    const s = String(v ?? '')
    return (s.includes(',') || s.includes('"') || s.includes('\n'))
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  const row = cols => cols.map(cell).join(',')

  const weekHeaders = weeks.map(w => `${w.startLabel} – ${w.endLabel}`)
  const lines = []

  // Title + export date
  lines.push(row(['Designer Capacity Planner']))
  lines.push(row([`Exported: ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`]))
  lines.push('')

  // Column headers
  lines.push(row(['Designer', 'Row Type', 'Total Hours', ...weekHeaders]))

  // One section per designer
  designers.forEach(designer => {
    const totalCap = weeks.reduce((s, w) => s + (designer.capacity[w.id] ?? 0), 0)

    // Capacity row
    lines.push(row([
      designer.name,
      'Capacity',
      totalCap,
      ...weeks.map(w => designer.capacity[w.id] ?? 0),
    ]))

    // Project rows
    designer.projects.forEach(project => {
      const total = weeks.reduce((s, w) => s + (project.hours[w.id] ?? 0), 0)
      lines.push(row([
        designer.name,
        project.name,
        total,
        ...weeks.map(w => project.hours[w.id] ?? 0),
      ]))
    })

    // Blank row between designers for readability
    lines.push('')
  })

  // Grand total row
  const weekTotals = weeks.map(w =>
    designers.reduce((s, d) => s + d.projects.reduce((ps, p) => ps + (p.hours[w.id] ?? 0), 0), 0)
  )
  lines.push(row([
    'ALL DESIGNERS',
    'Total Hours',
    weekTotals.reduce((s, v) => s + v, 0),
    ...weekTotals,
  ]))

  // UTF-8 BOM ensures Google Sheets / Excel open it with correct encoding
  const csv  = '﻿' + lines.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href  = URL.createObjectURL(blob)
  link.download = `designer-workload-${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// ─── PNG export ───────────────────────────────────────────────────────────────
async function exportToPNG() {
  const btn  = document.querySelector('[data-action="export-png"]')
  const label = btn?.querySelector('span')
  if (btn)   { btn.disabled = true }
  if (label) { label.textContent = 'Exporting…' }

  try {
    const canvas = await html2canvas(document.getElementById('app'), {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      onclone: (doc) => {
        // Remove all overflow/height constraints so the full content renders
        doc.documentElement.style.overflow = 'visible'
        doc.documentElement.style.height   = 'auto'
        doc.body.style.overflow = 'visible'
        doc.body.style.height   = 'auto'
        const app = doc.getElementById('app')
        if (app) { app.style.height = 'auto'; app.style.overflow = 'visible' }
        const scroller = doc.getElementById('scroll-container')
        if (scroller) { scroller.style.height = 'auto'; scroller.style.overflow = 'visible' }
        // Sticky header should render in natural document flow, not float above content
        const sticky = doc.querySelector('.week-headers-sticky')
        if (sticky) sticky.style.position = 'relative'
      },
    })

    const link = document.createElement('a')
    link.download = `designer-workload-${new Date().toISOString().slice(0,10)}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('PNG export failed:', err)
    alert('Export failed — check the browser console for details.')
  } finally {
    if (btn)   { btn.disabled = false }
    if (label) { label.textContent = 'Export PNG' }
  }
}

// ─── Global keydown (Escape closes modal / add-designer form) ─────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return
  if (state.confirm) { state.confirm = null; hideModal(); return }
  if (state.addDesignerOpen) { state.addDesignerOpen = false; render() }
})

// Keydown inside add-designer input
document.getElementById('app').addEventListener('keydown', e => {
  if (e.target.id !== 'add-designer-input') return
  if (e.key === 'Enter')  submitNewDesigner(e.target.value)
  if (e.key === 'Escape') { state.addDesignerOpen = false; render() }
})

// ─── Setup & bootstrap ────────────────────────────────────────────────────────
function setupEvents() {
  const app   = document.getElementById('app')
  const modal = document.getElementById('modal-root')

  app.addEventListener('click',     handleClick)
  app.addEventListener('dragstart', handleDragStart)
  app.addEventListener('dragend',   handleDragEnd)
  app.addEventListener('dragover',  handleDragOver)
  app.addEventListener('dragleave', handleDragLeave)
  app.addEventListener('drop',      handleDrop)

  modal.addEventListener('click', handleModalClick)
}

loadState()
render()
setupEvents()
