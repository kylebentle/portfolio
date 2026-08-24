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
const STORAGE_VERSION = 'v10-designer-first'

// ─── Per-client color palette ──────────────────────────────────────────────────
// Assigned to clients by a stable hash of their id (not array position), so a
// client's color survives reordering, additions, and removals elsewhere in the
// roster — the same client always looks the same everywhere it's shown, even
// nested under several different designers. Cycles if there are ever more than
// 5 clients; hues are spread around the wheel so they stay distinguishable from
// each other and from the app's navy-blue chrome.
const CLIENT_PALETTES = [
  { light: '#FFE5F7', dark: '#73004F', accent: '#B00079' }, // magenta
  { light: '#D7F5F0', dark: '#00544A', accent: '#007A68' }, // teal
  { light: '#FFEFCF', dark: '#7A4A00', accent: '#B36B00' }, // amber
  { light: '#EAE3FF', dark: '#341F8A', accent: '#4B2FC4' }, // violet
  { light: '#FFE1D6', dark: '#7A2A0E', accent: '#B0431A' }, // terracotta
]
function paletteForClient(clientId) {
  let hash = 0
  for (let i = 0; i < clientId.length; i++) hash = (hash * 31 + clientId.charCodeAt(i)) | 0
  return CLIENT_PALETTES[Math.abs(hash) % CLIENT_PALETTES.length]
}

// ─── Seed data (designer-first shape: designer.clients[] holds { id, clientId, projects }) ──
const ALL_ZERO = Object.fromEntries(WEEK_IDS.map(w => [w, 0]))
const ALL_40   = Object.fromEntries(WEEK_IDS.map(w => [w, 40]))

// Week indices: w0=Jan6, w1=Jan13, w2=Jan20, w3=Jan27, w4=Feb3, w5=Feb10, w6=Feb17, w7=Feb24
// Alex Rivera and Sam Chen are each staffed on two clients at once (their weekly totals below
// are the sum across both): Alex [40,40,44↑,44↑,36↓,40,40,40] · Sam [40,40,44↑,40,36↓,40,40,40]
// Jordan Kim and Morgan Taylor are single-client: Jordan [24,28,24,20,24,24,28,24] (has slack)
// · Morgan [40,40,36↓,40,40,48↑,40,40]
const SEED_DATA = {
  designers: [
    {
      id: 'd1', name: 'Alex Rivera', capacity: { ...ALL_40 },
      clients: [
        {
          id: 'a1', clientId: 'c1', // Acme Corp
          projects: [
            { id: 'p1', name: 'Brand Refresh',       hours: { w0:20, w1:20, w2:24, w3:20, w4:20, w5:16, w6:20, w7:20 } },
            { id: 'p2', name: 'Design System Audit', hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
          ],
        },
        {
          id: 'a5', clientId: 'c3', // Initech
          projects: [
            { id: 'p8', name: 'Mobile App v2', hours: { w0:12, w1:12, w2:12, w3:16, w4:8, w5:16, w6:12, w7:12 } },
          ],
        },
      ],
    },
    {
      id: 'd2', name: 'Sam Chen', capacity: { ...ALL_40 },
      clients: [
        {
          id: 'a2', clientId: 'c1', // Acme Corp
          projects: [
            { id: 'p3', name: 'Checkout Redesign', hours: { w0:16, w1:20, w2:16, w3:16, w4:12, w5:16, w6:16, w7:20 } },
            { id: 'p4', name: 'Component Library', hours: { w0:12, w1:12, w2:12, w3:12, w4:12, w5:12, w6:12, w7:12 } },
          ],
        },
        {
          id: 'a3', clientId: 'c2', // Globex Inc
          projects: [
            { id: 'p5', name: 'Onboarding Flow', hours: { w0:12, w1:8, w2:16, w3:12, w4:12, w5:12, w6:12, w7:8 } },
          ],
        },
      ],
    },
    {
      id: 'd3', name: 'Jordan Kim', capacity: { ...ALL_40 },
      clients: [
        {
          id: 'a4', clientId: 'c2', // Globex Inc
          projects: [
            { id: 'p6', name: 'Dashboard Redesign', hours: { w0:16, w1:20, w2:16, w3:12, w4:16, w5:16, w6:20, w7:16 } },
            { id: 'p7', name: 'User Research',      hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
          ],
        },
      ],
    },
    {
      id: 'd4', name: 'Morgan Taylor', capacity: { ...ALL_40 },
      clients: [
        {
          id: 'a6', clientId: 'c3', // Initech
          projects: [
            { id: 'p9',  name: 'Email Templates',     hours: { w0:16, w1:16, w2:16, w3:16, w4:16, w5:20, w6:16, w7:16 } },
            { id: 'p10', name: 'Settings Revamp',     hours: { w0:16, w1:16, w2:12, w3:16, w4:16, w5:20, w6:16, w7:16 } },
            { id: 'p11', name: 'Accessibility Audit', hours: { w0:8,  w1:8,  w2:8,  w3:8,  w4:8,  w5:8,  w6:8,  w7:8  } },
          ],
        },
      ],
    },
  ],
  clients: [
    { id: 'c1', name: 'Acme Corp' },
    { id: 'c2', name: 'Globex Inc' },
    { id: 'c3', name: 'Initech' },
  ],
}

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

// ─── State migration ────────────────────────────────────────────────────────────
function fillWeeks(obj, fallbackDefault) {
  const known = WEEK_IDS.filter(w => obj[w] !== undefined)
  const def = known.length ? obj[known[known.length - 1]] : fallbackDefault
  const out = { ...obj }
  WEEK_IDS.forEach(w => { if (out[w] === undefined) out[w] = def })
  return out
}

// Migrates a client-centric snapshot ({ designers, clients: [{ assignments }] }) into the
// current designer-centric shape ({ designers: [{ clients }], clients }), preserving every
// real hour/capacity value rather than discarding it.
function migrateClientCentricToDesignerCentric(old) {
  const designers = (old.designers ?? []).map(d => ({ id: d.id, name: d.name, capacity: fillWeeks(d.capacity, 40), clients: [] }))
  const designerById = new Map(designers.map(d => [d.id, d]))
  const clients = (old.clients ?? []).map(c => ({ id: c.id, name: c.name }))

  ;(old.clients ?? []).forEach(c => (c.assignments ?? []).forEach(a => {
    const designer = designerById.get(a.designerId)
    if (!designer) { console.warn(`Migration: dropping assignment ${a.id} — unknown designerId ${a.designerId}`); return }
    designer.clients.push({
      id: a.id,
      clientId: c.id,
      projects: (a.projects ?? []).map(p => ({ ...p, hours: fillWeeks(p.hours, 0) })),
    })
  }))

  return { designers, clients }
}

// Accepts the oldest flat pre-client shape (array of designers with inline projects+capacity),
// today's client-centric shape, or the current designer-centric shape — and normalizes any of
// them into { designers: [{ clients: [{ projects }] }], clients }.
function migrateState(raw) {
  if (Array.isArray(raw)) {
    const designers = raw.map(d => ({
      id: d.id, name: d.name, capacity: fillWeeks(d.capacity, 40),
      clients: [{
        id: uid(),
        clientId: 'general',
        projects: d.projects.map(p => ({ ...p, hours: fillWeeks(p.hours, 0) })),
      }],
    }))
    return { designers, clients: [{ id: 'general', name: 'General' }] }
  }

  if (raw.designers?.[0]?.clients !== undefined) {
    const designers = (raw.designers ?? []).map(d => ({
      ...d,
      capacity: fillWeeks(d.capacity, 40),
      clients: (d.clients ?? []).map(cb => ({
        ...cb,
        projects: cb.projects.map(p => ({ ...p, hours: fillWeeks(p.hours, 0) })),
      })),
    }))
    const clients = (raw.clients ?? []).map(c => ({ id: c.id, name: c.name }))
    return { designers, clients }
  }

  return migrateClientCentricToDesignerCentric(raw)
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
function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA), lB = relativeLuminance(hexB)
  const lighter = Math.max(lA, lB), darker = Math.min(lA, lB)
  return (lighter + 0.05) / (darker + 0.05)
}
// Picks white or black text for a given background — whichever contrasts more —
// so heatmap cells always clear WCAG AA (4.5:1) even in the mid-luminance range
// where #1A1F36 (textPrimary) isn't dark enough to guarantee it on its own.
function wcagTextColor(bgHex) {
  return contrastRatio(bgHex, '#FFFFFF') >= contrastRatio(bgHex, '#000000')
    ? '#FFFFFF' : '#000000'
}
function interpolateHex(a, b, t) {
  const r1=parseInt(a.slice(1,3),16), g1=parseInt(a.slice(3,5),16), b1=parseInt(a.slice(5,7),16)
  const r2=parseInt(b.slice(1,3),16), g2=parseInt(b.slice(3,5),16), b2=parseInt(b.slice(5,7),16)
  const r=Math.round(r1+(r2-r1)*t), g=Math.round(g1+(g2-g1)*t), bv=Math.round(b1+(b2-b1)*t)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bv.toString(16).padStart(2,'0')}`
}
function getHourHeat(hours, ramp = { light: C.magenta100, dark: C.magenta900 }) {
  if (!hours || hours <= 0) return { bg: null, fg: C.textMuted }
  const t  = Math.min(hours, HOUR_HEAT_MAX) / HOUR_HEAT_MAX
  const bg = interpolateHex(ramp.light, ramp.dark, t)
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
  designers: [],             // top-level roster: { id, name, capacity, clients: [{ id, clientId, projects }] }
  clients: [],               // global client identities only: { id, name }
  expandedDesigners: new Set(),
  expandedClientBlocks: new Set(),
  confirm: null,
  addDesignerOpen: false,
  addClientOpenFor: null,    // designer id whose "add client" inline form is open
  clientFilter: null,        // client id to show exclusively, or null for "All Clients"
}

let dragCtx = null  // null | { scope: 'designer', index } | { scope: 'client-block', designerId, index }

function loadState() {
  try {
    // Informational only — never gates a wipe. Loading is purely shape-detection-based
    // (see migrateState) so real saved data survives a restructuring like this one.
    localStorage.setItem('cp_version', STORAGE_VERSION)
    const saved = localStorage.getItem('cp_state')
    const migrated = migrateState(saved ? JSON.parse(saved) : SEED_DATA)
    state.designers = migrated.designers
    state.clients   = migrated.clients
  } catch {
    const migrated = migrateState(JSON.parse(JSON.stringify(SEED_DATA)))
    state.designers = migrated.designers
    state.clients   = migrated.clients
  }
  state.expandedDesigners = new Set(state.designers.map(d => d.id))
  state.expandedClientBlocks = new Set(state.designers.flatMap(d => d.clients.map(cb => cb.id)))
}

function saveState() {
  try {
    localStorage.setItem('cp_state', JSON.stringify({ designers: state.designers, clients: state.clients }))
  } catch {}
}

// Removes a client from the global roster once no designer references it anymore.
function pruneOrphanClient(clientId) {
  const stillReferenced = state.designers.some(d => d.clients.some(cb => cb.clientId === clientId))
  if (!stillReferenced) state.clients = state.clients.filter(c => c.id !== clientId)
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
function iconWarning(s=13) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.3l6 10.4c.3.55-.08 1.2-.7 1.2H1.7c-.62 0-1-.65-.7-1.2L7 1.3z" fill="currentColor"/>
    <rect x="6.35" y="5" width="1.3" height="3.2" rx="0.65" fill="#fff"/>
    <rect x="6.35" y="9.1" width="1.3" height="1.3" rx="0.65" fill="#fff"/>
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

// datasetExtra: plain object of extra data-* attributes (key already dash-cased, e.g. 'designer-id')
function renderHourCell(value, weekId, editType, datasetExtra, heatmap, ramp) {
  const heat = heatmap ? getHourHeat(value, ramp) : null
  const bg   = heat?.bg ?? 'transparent'
  const fg   = heat ? heat.fg : (value > 0 ? C.textPrimary : C.textMuted)
  const cls  = `hour-cell${editType === 'hours' ? '' : ' cap-cell'}`
  const attrs = Object.entries(datasetExtra).map(([k,v]) => ` data-${k}="${esc(v)}"`).join('')

  return `<div class="${cls}" data-edit="${editType}" data-week-id="${weekId}"${attrs} data-edit-value="${value}" data-bg="${bg}" style="background:${bg}">
    ${value === 0
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:${C.textMuted}">–</span>`
      : `<span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:400;color:${fg}">${value}</span>`
    }
  </div>`
}

function renderUtilCell(booked, capacity, isCurrentWeek) {
  const pct = capacity > 0 ? Math.round((booked / capacity) * 100) : 0
  const overflow = pct > 100
  const fg = overflow ? C.magenta700 : (isCurrentWeek ? C.navy700 : C.textSecondary)
  const bg = overflow ? C.magenta100 : (isCurrentWeek ? C.navy50 : 'transparent')
  return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px 8px;border-radius:8px;background:${bg}">
    <span style="display:flex;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:${fg};line-height:1">
      ${overflow ? `<span style="line-height:0">${iconWarning(12)}</span>` : ''}${capacity===0?'–':`${pct}%`}
    </span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${fg};line-height:1">${booked}/${capacity}h</span>
    <div style="width:100%;margin-top:3px">
      <div style="width:100%;height:4px;border-radius:2px;background:${C.borderLight};overflow:hidden">
        <div style="width:${Math.min(pct,100)}%;height:100%;background:${overflow?C.magenta500:C.textSecondary};border-radius:2px;transition:width 0.3s"></div>
      </div>
      ${overflow ? `<div style="width:${Math.min(pct-100,100)}%;height:2px;background:${C.magenta500};border-radius:2px;margin-top:2px"></div>` : ''}
    </div>
  </div>`
}

// ─── Render: by-client rollup ──────────────────────────────────────────────────
function renderClientRollup(clients, designers, weeks) {
  if (!clients.length) return ''

  const linksByClient = new Map()
  designers.forEach(designer => designer.clients.forEach(clientBlock => {
    if (!linksByClient.has(clientBlock.clientId)) linksByClient.set(clientBlock.clientId, [])
    linksByClient.get(clientBlock.clientId).push({ designer, clientBlock })
  }))

  const rows = clients.map(c => {
    const links = linksByClient.get(c.id) ?? []
    const bookedForWeek = w => links.reduce((s, l) => s + l.clientBlock.projects.reduce((ps,p) => ps + (p.hours[w]??0), 0), 0)
    const capForWeek    = w => links.reduce((s, l) => s + (l.designer.capacity[w]??0), 0)
    const totalBooked   = weeks.reduce((s, w) => s + bookedForWeek(w.id), 0)
    const designerNames = links.map(l => l.designer.name)

    return `<div class="rollup-row" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid ${C.borderLight}">
      <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:2px;padding-left:4px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;font-weight:600;color:${C.navy900};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</span>
          <button class="icon-btn trash-btn" data-action="remove-client-global" data-client-id="${c.id}" title="Remove client entirely" style="color:${C.textMuted}">
            ${iconTrash(13)}
          </button>
        </div>
        <span style="font-size:10px;color:${C.textMuted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${designerNames.length ? esc(designerNames.join(', ')) : 'Not staffed by any designer'}</span>
      </div>
      ${renderTotalCell(totalBooked)}
      ${weeks.map(w => `
        <div style="flex:1;min-width:58px;display:flex;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
          ${renderUtilCell(bookedForWeek(w.id), capForWeek(w.id), w.isCurrentWeek)}
        </div>`).join('')}
    </div>`
  }).join('')

  return `<div style="margin-top:32px">
    <div style="font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textMuted};margin-bottom:10px;padding-left:2px">By Client</div>
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;box-shadow:0 2px 8px ${C.shadow};overflow:hidden">
      ${rows}
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
function renderProjectRow(project, weeks, designerId, blockId, ramp, designerCapacity) {
  const projectTotal = weeks.reduce((s, w) => s + (project.hours[w.id]??0), 0)
  const pct = designerCapacity > 0 ? (projectTotal / designerCapacity) * 100 : 0

  return `<div class="project-row">
    <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:5px;padding-left:58px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;min-width:0">
          <span class="editable-text" data-edit="project-name" data-designer-id="${designerId}" data-block-id="${blockId}" data-project-id="${project.id}"
            style="font-size:13px;font-weight:500;color:${C.textPrimary};display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text"
          >${esc(project.name)}</span>
        </div>
        <button class="icon-btn trash-btn" data-action="remove-project" data-designer-id="${designerId}" data-block-id="${blockId}" data-project-id="${project.id}" title="Remove project" style="color:${C.textMuted}">
          ${iconTrash(13)}
        </button>
      </div>
      <div style="padding-left:16px;padding-right:2px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;height:3px;background:${C.borderLight};border-radius:2px;overflow:hidden">
            <div style="width:${Math.min(pct,100)}%;height:100%;background:${C.textSecondary};border-radius:2px;opacity:0.65;transition:width 0.3s"></div>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;color:${pct>0?C.textSecondary:C.textMuted};white-space:nowrap;min-width:28px;text-align:right" title="Share of ${esc(project.name)}'s designer's total capacity">${pct>0?`${Math.round(pct)}%`:'–'}</span>
        </div>
      </div>
    </div>
    ${renderTotalCell(projectTotal)}
    ${weeks.map(w => `
      <div style="flex:1;min-width:58px;display:flex;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
        ${renderHourCell(project.hours[w.id]??0, w.id, 'hours', {'designer-id': designerId, 'block-id': blockId, 'project-id': project.id}, true, ramp)}
      </div>`).join('')}
  </div>`
}

// ─── Render: client block (one client, nested inside one designer) ────────────
function renderClientBlock(clientBlock, client, weeks, designer, blockIndex, palette) {
  if (!client) return ''
  const expanded         = state.expandedClientBlocks.has(clientBlock.id)
  const totalBooked      = weeks.reduce((s, w) => s + clientBlock.projects.reduce((ps, p) => ps + (p.hours[w.id]??0), 0), 0)
  const designerCapacity = weeks.reduce((s, w) => s + (designer.capacity[w.id]??0), 0)
  const pct              = designerCapacity > 0 ? Math.round((totalBooked / designerCapacity) * 100) : 0
  const overflow         = pct > 100

  return `<div class="client-block-wrapper" data-designer-id="${designer.id}" data-block-index="${blockIndex}">
    <div class="designer-header${expanded?'':' collapsed'}" data-action="toggle-expand-client-block" data-designer-id="${designer.id}" data-block-id="${clientBlock.id}">
      <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:4px;padding-left:26px">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="grip-icon" draggable="true" data-drag-handle data-drag-scope="client-block" data-designer-id="${designer.id}" data-block-index="${blockIndex}" title="Drag to reorder">
            ${iconGrip(13)}
          </span>
          <span style="color:${C.textSecondary};line-height:0">${iconChevron(expanded)}</span>
          <div style="flex:1;min-width:0">
            <span class="editable-text" data-edit="client-name" data-client-id="${client.id}"
              style="font-size:14px;font-weight:600;color:${palette.accent};cursor:text;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
            >${esc(client.name)}</span>
          </div>
          <span class="hover-reveal" style="color:${C.textMuted};pointer-events:none;line-height:0">${iconPencil()}</span>
          <span style="font-size:11px;color:${C.textMuted};flex-shrink:0;white-space:nowrap">${clientBlock.projects.length} project${clientBlock.projects.length!==1?'s':''}</span>
          <button class="icon-btn hover-reveal" data-action="remove-client-block" data-designer-id="${designer.id}" data-block-id="${clientBlock.id}" title="Remove this client from ${esc(designer.name)}" style="color:${C.textMuted}">
            ${iconTrash(14)}
          </button>
        </div>
        <div style="padding-left:22px;padding-right:2px" title="${esc(designer.name)}'s load on ${esc(client.name)} vs. their overall weekly capacity">
          <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:3px">
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${C.textSecondary}">${totalBooked}h <span style="color:${C.textMuted}">/ ${designerCapacity}h</span></span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:${overflow?C.magenta700:C.textSecondary}">${designerCapacity>0?`${pct}%`:'–'}</span>
          </div>
          <div style="height:3px;background:${C.borderLight};border-radius:2px;overflow:hidden">
            <div style="width:${Math.min(pct,100)}%;height:100%;background:${overflow?C.magenta500:palette.accent};border-radius:2px;transition:width 0.3s"></div>
          </div>
        </div>
      </div>
      ${renderTotalCell(totalBooked)}
      ${weeks.map(w => {
        const booked = clientBlock.projects.reduce((s, p) => s + (p.hours[w.id]??0), 0)
        return `<div style="flex:1;min-width:58px;display:flex;align-items:center;justify-content:center;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
          <span style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:${booked>0?700:400};color:${booked>0?palette.accent:C.textMuted}">${booked>0?`${booked}h`:'–'}</span>
        </div>`
      }).join('')}
    </div>

    ${expanded ? `
      ${clientBlock.projects.map(p => renderProjectRow(p, weeks, designer.id, clientBlock.id, palette, designerCapacity)).join('')}
      <div style="padding:7px 16px 9px 78px">
        <button class="add-proj-btn" data-action="add-project" data-designer-id="${designer.id}" data-block-id="${clientBlock.id}">
          ${iconPlus(12)} Add project
        </button>
      </div>
    ` : ''}
  </div>`
}

// ─── Render: designer card ──────────────────────────────────────────────────────
// visibleClients: array of { cb, bi } — cb is the client-block, bi its true index within
// designer.clients (preserved through any active client filter so drag-and-drop still
// splices the right position even when some blocks are hidden from view).
function renderDesignerCard(designer, index, visibleClients, weeks, clientById) {
  const expanded      = state.expandedDesigners.has(designer.id)
  const totalBooked   = weeks.reduce((s, w) => s + visibleClients.reduce((cs, {cb}) => cs + cb.projects.reduce((ps, p) => ps + (p.hours[w.id]??0), 0), 0), 0)
  const totalCapacity = weeks.reduce((s, w) => s + (designer.capacity[w.id]??0), 0)
  const pct           = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0
  const overflow      = pct > 100

  return `<div class="designer-card-wrapper" data-designer-index="${index}">
    <div class="designer-card" data-designer-id="${designer.id}">

      <div class="designer-header${expanded?'':' collapsed'}" data-action="toggle-expand-designer" data-designer-id="${designer.id}">
        <div style="width:280px;min-width:280px;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="grip-icon" draggable="true" data-drag-handle data-drag-scope="designer" data-designer-index="${index}" title="Drag to reorder">
              ${iconGrip(13)}
            </span>
            <span style="color:${C.textSecondary};line-height:0">${iconChevron(expanded)}</span>
            <div style="flex:1;min-width:0">
              <span class="editable-text" data-edit="designer-name" data-designer-id="${designer.id}"
                style="font-size:20px;font-weight:700;color:${C.navy900};cursor:text;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
              >${esc(designer.name)}</span>
            </div>
            <span class="hover-reveal" style="color:${C.textMuted};pointer-events:none;line-height:0">${iconPencil()}</span>
            <span style="font-size:11px;color:${C.textMuted};flex-shrink:0;white-space:nowrap">${designer.clients.length} client${designer.clients.length!==1?'s':''}</span>
            <button class="icon-btn hover-reveal" data-action="remove-designer" data-designer-id="${designer.id}" title="Remove designer" style="color:${C.textMuted}">
              ${iconTrash(14)}
            </button>
          </div>
          <div style="padding-left:43px;padding-right:2px" title="${esc(designer.name)}'s total booked load vs. their overall weekly capacity">
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:3px">
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${C.textSecondary}">${totalBooked}h <span style="color:${C.textMuted}">/ ${totalCapacity}h</span></span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:${overflow?C.magenta700:C.textSecondary}">${totalCapacity>0?`${pct}%`:'–'}</span>
            </div>
            <div style="height:4px;background:${C.borderLight};border-radius:2px;overflow:hidden">
              <div style="width:${Math.min(pct,100)}%;height:100%;background:${overflow?C.magenta500:C.textSecondary};border-radius:2px;transition:width 0.3s"></div>
            </div>
          </div>
        </div>
        ${renderTotalCell(totalBooked)}
        ${weeks.map(w => {
          const booked = visibleClients.reduce((s, {cb}) => s + cb.projects.reduce((ps, p) => ps + (p.hours[w.id]??0), 0), 0)
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
          ${renderTotalCell(totalCapacity)}
          ${weeks.map(w => `
            <div style="flex:1;min-width:58px;display:flex;padding:${w.isMonthBoundary?'0 4px 0 6px':'0 4px'};${w.isMonthBoundary?`border-left:2px solid ${C.border}`:''}">
              ${renderHourCell(designer.capacity[w.id]??0, w.id, 'capacity', {'designer-id': designer.id}, false)}
            </div>`).join('')}
        </div>
        ${visibleClients.map(({cb, bi}) => renderClientBlock(cb, clientById.get(cb.clientId), weeks, designer, bi, paletteForClient(cb.clientId))).join('')}
        <div style="padding:8px 16px 10px 32px">
          ${renderAddClientToDesigner(designer)}
        </div>
      ` : ''}

    </div>
  </div>`
}

// ─── Render: totals row ────────────────────────────────────────────────────────
// designerEntries: array of { designer, index, visibleClients } — see renderApp.
function renderTotalsRow(designerEntries, weeks) {
  const weekTotal = w => designerEntries.reduce((s, {visibleClients}) => s + visibleClients.reduce((cs, {cb}) => cs + cb.projects.reduce((ps, p) => ps + (p.hours[w]??0), 0), 0), 0)
  const grand     = weeks.reduce((s, w) => s + weekTotal(w.id), 0)
  const filteredClient = state.clientFilter && state.clients.find(c => c.id === state.clientFilter)
  const label = filteredClient ? `All Designers — ${esc(filteredClient.name)}` : 'All Designers'

  return `<div style="margin-top:32px">
    <div style="font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textMuted};margin-bottom:10px;padding-left:2px">Total Hours</div>
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;box-shadow:0 2px 8px ${C.shadow};overflow:hidden;display:flex;align-items:center;gap:10px;padding:0 12px;min-height:52px">
      <div style="width:280px;min-width:280px;padding-left:4px;display:flex;align-items:center;gap:8px">
        <span style="font-size:13px;font-weight:700;color:${C.textSecondary}">${label}</span>
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

// ─── Render: add designer (top-level) ──────────────────────────────────────────
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

// ─── Render: add client to a designer ──────────────────────────────────────────
function renderAddClientToDesigner(designer) {
  if (state.addClientOpenFor !== designer.id) {
    return `<button class="add-proj-btn" data-action="open-add-client-to-designer" data-designer-id="${designer.id}">
      ${iconPlus(12)} Add client
    </button>`
  }
  return `<div style="display:flex;align-items:center;gap:8px">
    <input id="add-client-input-${designer.id}" class="add-designer-input" list="client-roster-datalist"
      style="font-size:13px;padding:5px 8px" placeholder="Client name" autocomplete="off" data-designer-id="${designer.id}" />
    <button data-action="submit-add-client-to-designer" data-designer-id="${designer.id}" style="font-family:'Jost',sans-serif;font-size:12px;font-weight:600;color:#fff;background:${C.navy900};border:none;border-radius:6px;padding:5px 12px;cursor:pointer">Add</button>
    <button data-action="cancel-add-client-to-designer" style="font-family:'Jost',sans-serif;font-size:12px;font-weight:500;color:${C.textSecondary};background:none;border:1px solid ${C.border};border-radius:6px;padding:5px 9px;cursor:pointer">Cancel</button>
  </div>`
}

function renderClientDatalist(clients) {
  return `<datalist id="client-roster-datalist">
    ${clients.map(c => `<option value="${esc(c.name)}"></option>`).join('')}
  </datalist>`
}

// ─── Render: client filter ─────────────────────────────────────────────────────
function renderClientFilter() {
  return `<div style="display:flex;align-items:center;gap:8px">
    <label for="client-filter" style="font-size:12px;font-weight:500;color:${C.textSecondary}">Client</label>
    <select id="client-filter" style="font-family:'Jost',sans-serif;font-size:13px;font-weight:500;color:${C.navy900};background:#fff;border:1px solid ${C.border};border-radius:8px;padding:6px 10px;cursor:pointer;max-width:200px">
      <option value="">All Clients</option>
      ${state.clients.map(c => `<option value="${c.id}" ${state.clientFilter===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}
    </select>
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
      ${renderClientFilter()}
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
  const weeks = getWeeks()

  // Guard against a filter pointing at a client that no longer exists (removed globally,
  // or auto-pruned after its last designer detached) — fall back to "All Clients" rather
  // than silently rendering an empty board.
  if (state.clientFilter && !state.clients.some(c => c.id === state.clientFilter)) {
    state.clientFilter = null
  }
  const clientFilter = state.clientFilter
  const clientById   = new Map(state.clients.map(c => [c.id, c]))

  // Rollup and "add client" datalist always see the full roster; only which designer cards
  // and client-blocks render gets narrowed by the filter.
  const rollupClients = clientFilter ? state.clients.filter(c => c.id === clientFilter) : state.clients

  const designerEntries = state.designers
    .map((d, i) => ({
      designer: d,
      index: i,
      // bi is the block's true index within designer.clients — preserved through the filter
      // so drag-and-drop still targets the right position even when some blocks are hidden.
      visibleClients: d.clients
        .map((cb, bi) => ({ cb, bi }))
        .filter(({cb}) => !clientFilter || cb.clientId === clientFilter),
    }))
    .filter(({visibleClients}) => !clientFilter || visibleClients.length > 0)

  return `
    ${renderNav()}
    <div id="scroll-container">
      <div class="content">
        ${renderWeekHeaders(weeks)}
        <div style="display:flex;flex-direction:column;gap:10px">
          ${designerEntries.map(({designer, index, visibleClients}) => renderDesignerCard(designer, index, visibleClients, weeks, clientById)).join('')}
          ${renderAddDesigner()}
        </div>
        ${renderTotalsRow(designerEntries, weeks)}
        ${renderClientRollup(rollupClients, state.designers, weeks)}
      </div>
    </div>
    ${renderClientDatalist(state.clients)}
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
  if (state.addClientOpenFor) {
    document.getElementById(`add-client-input-${state.addClientOpenFor}`)?.focus()
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
    const type = span.dataset.edit

    if (type === 'client-name') {
      const client = state.clients.find(c => c.id === span.dataset.clientId)
      if (client) client.name = trimmed
    } else if (type === 'designer-name') {
      const designer = state.designers.find(d => d.id === span.dataset.designerId)
      if (designer) designer.name = trimmed
    } else if (type === 'project-name') {
      const designer    = state.designers.find(d => d.id === span.dataset.designerId)
      const clientBlock = designer?.clients.find(cb => cb.id === span.dataset.blockId)
      const project      = clientBlock?.projects.find(p => p.id === span.dataset.projectId)
      if (project) project.name = trimmed
    }
    saveState()
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
  const bg      = cell.dataset.bg
  const fg      = (bg && bg !== 'transparent') ? wcagTextColor(bg) : C.textPrimary
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

    if (type === 'capacity') {
      const designer = state.designers.find(d => d.id === cell.dataset.designerId)
      if (designer) designer.capacity[cell.dataset.weekId] = val
    } else if (type === 'hours') {
      const designer    = state.designers.find(d => d.id === cell.dataset.designerId)
      const clientBlock = designer?.clients.find(cb => cb.id === cell.dataset.blockId)
      const project      = clientBlock?.projects.find(p => p.id === cell.dataset.projectId)
      if (project) project.hours[cell.dataset.weekId] = val
    }
    saveState()
    render()
  }

  input.addEventListener('blur',    commit)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur() }
    if (e.key === 'Escape') { e.stopPropagation(); render() }
  })
}

// ─── Change handler (client filter select) ─────────────────────────────────────
function handleChange(e) {
  if (e.target.id === 'client-filter') {
    state.clientFilter = e.target.value || null
    render()
  }
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

  if (action === 'toggle-expand-designer') {
    const id = btn.dataset.designerId
    if (state.expandedDesigners.has(id)) state.expandedDesigners.delete(id)
    else state.expandedDesigners.add(id)
    render()
    return
  }

  if (action === 'toggle-expand-client-block') {
    const id = btn.dataset.blockId
    if (state.expandedClientBlocks.has(id)) state.expandedClientBlocks.delete(id)
    else state.expandedClientBlocks.add(id)
    render()
    return
  }

  if (action === 'add-project') {
    const designer    = state.designers.find(d => d.id === btn.dataset.designerId)
    const clientBlock = designer?.clients.find(cb => cb.id === btn.dataset.blockId)
    if (clientBlock) {
      clientBlock.projects.push({ id: uid(), name: 'New Project', hours: Object.fromEntries(WEEK_IDS.map(w => [w,0])) })
      saveState(); render()
    }
    return
  }

  if (action === 'remove-project') {
    const designer    = state.designers.find(d => d.id === btn.dataset.designerId)
    const clientBlock = designer?.clients.find(cb => cb.id === btn.dataset.blockId)
    const project      = clientBlock?.projects.find(p => p.id === btn.dataset.projectId)
    const client       = state.clients.find(c => c.id === clientBlock?.clientId)
    if (designer && clientBlock && project) {
      state.confirm = {
        title: 'Remove project',
        message: `Remove "${project.name}" from ${designer.name}'s workload on ${client?.name ?? 'this client'}? This can't be undone.`,
        onConfirm: () => {
          clientBlock.projects = clientBlock.projects.filter(p => p.id !== project.id)
          saveState(); state.confirm = null; hideModal(); render()
        },
      }
      showModal()
    }
    return
  }

  if (action === 'remove-client-block') {
    e.stopPropagation()
    const designer    = state.designers.find(d => d.id === btn.dataset.designerId)
    const clientBlock = designer?.clients.find(cb => cb.id === btn.dataset.blockId)
    const client       = state.clients.find(c => c.id === clientBlock?.clientId)
    if (designer && clientBlock) {
      state.confirm = {
        title: 'Remove client',
        message: `Remove ${client?.name ?? 'this client'} and ${clientBlock.projects.length} project${clientBlock.projects.length!==1?'s':''} from ${designer.name}'s workload? Their profile and hours with other designers are kept.`,
        onConfirm: () => {
          designer.clients = designer.clients.filter(cb => cb.id !== clientBlock.id)
          state.expandedClientBlocks.delete(clientBlock.id)
          if (client) pruneOrphanClient(client.id)
          saveState(); state.confirm = null; hideModal(); render()
        },
      }
      showModal()
    }
    return
  }

  if (action === 'remove-client-global') {
    e.stopPropagation()
    const client = state.clients.find(c => c.id === btn.dataset.clientId)
    if (client) {
      const designerCount = state.designers.filter(d => d.clients.some(cb => cb.clientId === client.id)).length
      state.confirm = {
        title: 'Remove client',
        message: designerCount > 0
          ? `Remove ${client.name} completely? This unassigns it from ${designerCount} designer${designerCount!==1?'s':''} and deletes its roster entry. This can't be undone.`
          : `Remove ${client.name}'s roster entry? This can't be undone.`,
        onConfirm: () => {
          state.designers.forEach(d => {
            d.clients.forEach(cb => { if (cb.clientId === client.id) state.expandedClientBlocks.delete(cb.id) })
            d.clients = d.clients.filter(cb => cb.clientId !== client.id)
          })
          state.clients = state.clients.filter(c => c.id !== client.id)
          saveState(); state.confirm = null; hideModal(); render()
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
        message: designer.clients.length > 0
          ? `Remove ${designer.name} completely? This unassigns them from ${designer.clients.length} client${designer.clients.length!==1?'s':''} and deletes their profile. This can't be undone.`
          : `Remove ${designer.name}'s profile? This can't be undone.`,
        onConfirm: () => {
          const clientIds = designer.clients.map(cb => cb.clientId)
          state.designers = state.designers.filter(d => d.id !== designer.id)
          state.expandedDesigners.delete(designer.id)
          clientIds.forEach(cid => pruneOrphanClient(cid))
          saveState(); state.confirm = null; hideModal(); render()
        },
      }
      showModal()
    }
    return
  }

  if (action === 'export-csv')          { exportToCSV(); return }
  if (action === 'export-png')          { exportToPNG(); return }
  if (action === 'open-add-designer')   { state.addDesignerOpen = true;  render(); return }
  if (action === 'cancel-add-designer') { state.addDesignerOpen = false; render(); return }
  if (action === 'submit-add-designer') { submitNewDesigner(document.getElementById('add-designer-input')?.value ?? ''); return }

  if (action === 'open-add-client-to-designer')   { state.addClientOpenFor = btn.dataset.designerId; render(); return }
  if (action === 'cancel-add-client-to-designer') { state.addClientOpenFor = null; render(); return }
  if (action === 'submit-add-client-to-designer') {
    const input = document.getElementById(`add-client-input-${btn.dataset.designerId}`)
    submitClientToDesigner(btn.dataset.designerId, input?.value ?? '')
    return
  }
}

function submitNewDesigner(name) {
  const trimmed = name.trim()
  if (!trimmed) return
  const designer = { id: uid(), name: trimmed, capacity: { ...ALL_40 }, clients: [] }
  state.designers.push(designer)
  state.expandedDesigners.add(designer.id)
  state.addDesignerOpen = false
  saveState()
  render()
}

function submitClientToDesigner(designerId, name) {
  const trimmed = name.trim()
  if (!trimmed) return
  const designer = state.designers.find(d => d.id === designerId)
  if (!designer) return

  let client = state.clients.find(c => c.name.toLowerCase() === trimmed.toLowerCase())

  if (client && designer.clients.some(cb => cb.clientId === client.id)) {
    alert(`${designer.name} is already assigned to ${client.name}.`)
    return
  }

  if (!client) {
    client = { id: uid(), name: trimmed }
    state.clients.push(client)
  }

  const clientBlock = { id: uid(), clientId: client.id, projects: [] }
  designer.clients.push(clientBlock)
  state.expandedClientBlocks.add(clientBlock.id)
  state.addClientOpenFor = null
  saveState()
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

// ─── Drag and drop (two independent scopes: designer cards, and client-blocks nested
// within one designer) ──────────────────────────────────────────────────────────
function handleDragStart(e) {
  const handle = e.target.closest('[data-drag-handle]')
  if (!handle) { e.preventDefault(); return }
  const scope = handle.dataset.dragScope

  if (scope === 'designer') {
    dragCtx = { scope: 'designer', index: parseInt(handle.dataset.designerIndex) }
    handle.closest('.designer-card-wrapper').classList.add('is-dragging')
  } else if (scope === 'client-block') {
    dragCtx = { scope: 'client-block', designerId: handle.dataset.designerId, index: parseInt(handle.dataset.blockIndex) }
    handle.closest('.client-block-wrapper').classList.add('is-dragging')
  } else {
    e.preventDefault()
    return
  }
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', scope)
}

function handleDragEnd() {
  dragCtx = null
  document.querySelectorAll('.drag-over').forEach(el  => el.classList.remove('drag-over'))
  document.querySelectorAll('.is-dragging').forEach(el => el.classList.remove('is-dragging'))
}

function handleDragOver(e) {
  if (!dragCtx) return

  if (dragCtx.scope === 'client-block') {
    // Specific selector checked first, and scoped to the same designer — a client-block
    // must never be draggable into a different designer's list.
    const zone = e.target.closest('.client-block-wrapper')
    if (!zone || zone.dataset.designerId !== dragCtx.designerId) return
    e.preventDefault()
    const toIdx = parseInt(zone.dataset.blockIndex)
    if (toIdx !== dragCtx.index) {
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'))
      zone.classList.add('drag-over')
    }
    return
  }

  const zone = e.target.closest('.designer-card-wrapper')
  if (!zone) return
  e.preventDefault()
  const toIdx = parseInt(zone.dataset.designerIndex)
  if (toIdx !== dragCtx.index) {
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'))
    zone.classList.add('drag-over')
  }
}

function handleDragLeave(e) {
  const zone = dragCtx?.scope === 'client-block'
    ? e.target.closest('.client-block-wrapper')
    : e.target.closest('.designer-card-wrapper')
  if (zone && !zone.contains(e.relatedTarget)) zone.classList.remove('drag-over')
}

function handleDrop(e) {
  if (!dragCtx) return
  e.preventDefault()

  if (dragCtx.scope === 'client-block') {
    const zone = e.target.closest('.client-block-wrapper')
    if (zone && zone.dataset.designerId === dragCtx.designerId) {
      const toIdx = parseInt(zone.dataset.blockIndex)
      if (toIdx !== dragCtx.index) {
        const designer = state.designers.find(d => d.id === dragCtx.designerId)
        if (designer) {
          const arr = [...designer.clients]
          const [moved] = arr.splice(dragCtx.index, 1)
          arr.splice(toIdx, 0, moved)
          designer.clients = arr
          saveState()
        }
      }
    }
  } else {
    const zone = e.target.closest('.designer-card-wrapper')
    if (zone) {
      const toIdx = parseInt(zone.dataset.designerIndex)
      if (toIdx !== dragCtx.index) {
        const arr = [...state.designers]
        const [moved] = arr.splice(dragCtx.index, 1)
        arr.splice(toIdx, 0, moved)
        state.designers = arr
        saveState()
      }
    }
  }

  dragCtx = null
  render()
}

// ─── CSV export ───────────────────────────────────────────────────────────────
function exportToCSV() {
  const weeks       = getWeeks()
  const designers   = state.designers
  const clientById  = new Map(state.clients.map(c => [c.id, c]))

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
  lines.push(row(['Designer', 'Client', 'Row Type', 'Total Hours', ...weekHeaders]))

  // One section per designer: a leading Available Hours row, then one sub-section per client
  designers.forEach(designer => {
    const totalCap = weeks.reduce((s, w) => s + (designer.capacity[w.id] ?? 0), 0)
    lines.push(row([
      designer.name,
      '',
      'Available Hours',
      totalCap,
      ...weeks.map(w => designer.capacity[w.id] ?? 0),
    ]))

    designer.clients.forEach(clientBlock => {
      const client = clientById.get(clientBlock.clientId)
      if (!client) return

      clientBlock.projects.forEach(project => {
        const total = weeks.reduce((s, w) => s + (project.hours[w.id] ?? 0), 0)
        lines.push(row([
          designer.name,
          client.name,
          project.name,
          total,
          ...weeks.map(w => project.hours[w.id] ?? 0),
        ]))
      })
    })

    // Blank row between designers for readability
    lines.push('')
  })

  // By Client — Staffed Capacity (sum of every assigned designer's weekly capacity)
  lines.push(row(['By Client', 'Row Type', 'Total Hours', ...weekHeaders]))
  state.clients.forEach(client => {
    const links = designers.filter(d => d.clients.some(cb => cb.clientId === client.id))
    const capByWeek = w => links.reduce((s, d) => s + (d.capacity[w] ?? 0), 0)
    const totalCap = weeks.reduce((s, w) => s + capByWeek(w.id), 0)
    lines.push(row([
      client.name,
      'Staffed Capacity',
      totalCap,
      ...weeks.map(w => capByWeek(w.id)),
    ]))
  })
  lines.push('')

  // Grand total row
  const weekTotals = weeks.map(w =>
    designers.reduce((s, d) => s + d.clients.reduce((cs, cb) => cs + cb.projects.reduce((ps, p) => ps + (p.hours[w.id] ?? 0), 0), 0), 0)
  )
  lines.push(row([
    'ALL DESIGNERS',
    '',
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

// ─── Global keydown (Escape closes modal / add-designer / add-client forms) ───
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return
  if (state.confirm) { state.confirm = null; hideModal(); return }
  if (state.addDesignerOpen) { state.addDesignerOpen = false; render(); return }
  if (state.addClientOpenFor) { state.addClientOpenFor = null; render() }
})

// Keydown inside add-designer / add-client-to-designer inputs
document.getElementById('app').addEventListener('keydown', e => {
  if (e.target.id === 'add-designer-input') {
    if (e.key === 'Enter')  submitNewDesigner(e.target.value)
    if (e.key === 'Escape') { state.addDesignerOpen = false; render() }
    return
  }
  if (e.target.id?.startsWith('add-client-input-')) {
    const designerId = e.target.dataset.designerId
    if (e.key === 'Enter')  submitClientToDesigner(designerId, e.target.value)
    if (e.key === 'Escape') { state.addClientOpenFor = null; render() }
  }
})

// ─── Setup & bootstrap ────────────────────────────────────────────────────────
function setupEvents() {
  const app   = document.getElementById('app')
  const modal = document.getElementById('modal-root')

  app.addEventListener('click',     handleClick)
  app.addEventListener('change',    handleChange)
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
