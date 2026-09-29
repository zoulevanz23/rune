// WCAG 2.2 contrast check for the Rune token set (light + dark).
// Usage: node scripts/check-contrast.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(resolve(root, 'client/src/styles/tokens.css'), 'utf8')

const block = re => {
  const m = css.match(re)
  if (!m) throw new Error(`token block not found: ${re}`)
  const vars = {}
  const decl = /--([\w-]+)\s*:\s*([^;]+);/g
  let d
  while ((d = decl.exec(m[1]))) vars[`--${d[1]}`] = d[2].trim()
  return vars
}

const light = block(/:root\s*\{([\s\S]*?)\}/)
const dark = { ...light, ...block(/\[data-theme=['"]dark['"]\]\s*\{([\s\S]*?)\}/) }

const parseColor = (value, vars, depth = 0) => {
  if (depth > 8) throw new Error(`var() cycle at ${value}`)
  const v = value.trim()
  const varRef = v.match(/^var\(\s*(--[\w-]+)\s*\)$/)
  if (varRef) return parseColor(vars[varRef[1]], vars, depth + 1)
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map(c => c + c).join('') : hex[1]
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]
  }
  const rgba = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/)
  if (rgba) return [+rgba[1], +rgba[2], +rgba[3], rgba[4] === undefined ? 1 : +rgba[4]]
  throw new Error(`unsupported color: ${value}`)
}

const over = (fg, bg) => {
  const a = fg[3]
  return [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
    1,
  ]
}

const lum = ([r, g, b]) => {
  const f = c => {
    c /= 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

// [foreground, background, minimum ratio]
const pairs = [
  ['--ink', '--bg', 4.5],
  ['--ink', '--surface', 4.5],
  ['--ink', '--surface-2', 4.5],
  ['--ink', '--surface-3', 4.5],
  ['--muted', '--bg', 4.5],
  ['--muted', '--surface', 4.5],
  ['--muted', '--surface-2', 4.5],
  ['--ink-mute', '--bg', 4.5],
  ['--ink-mute', '--surface', 4.5],
  ['--ink-mute', '--surface-2', 4.5],
  ['--primary-text', '--surface', 4.5],
  ['--primary-text', '--bg', 4.5],
  ['--primary-text', '--surface-2', 4.5],
  ['--on-primary', '--primary', 4.5],
  ['--success-text', '--success-soft', 4.5],
  ['--warning-text', '--warning-soft', 4.5],
  ['--danger-text', '--danger-soft', 4.5],
  ['--primary-text', '--primary-soft', 4.5],
  ['--nav-text', '--nav', 4.5],
  ['--nav-muted', '--nav', 4.5],
  ['--nav-text', '--nav-2', 4.5],
  ['--border', '--surface', 1.3],
  ['--border-strong', '--surface', 1.4],
  ['--primary', '--surface', 3],
]

let failures = 0
const run = name => {
  const vars = name === 'dark' ? dark : light
  console.log(`\n${name.toUpperCase()} THEME`)
  for (const [fgName, bgName, min] of pairs) {
    const backing = parseColor(vars['--bg'], vars)
    let bg = parseColor(vars[bgName], vars)
    if (bg[3] < 1) bg = over(bg, backing)
    let fg = parseColor(vars[fgName], vars)
    if (fg[3] < 1) fg = over(fg, bg)
    report(fgName, bgName, ratio(fg, bg), min)
  }
}

const report = (fgName, bgName, r, min) => {
  const ok = r >= min
  if (!ok) failures++
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1 (min ${min})  ${fgName} on ${bgName}`
  )
}

run('light')
run('dark')

console.log(
  failures === 0 ? '\nAll token pairs meet their minimum contrast ratio.' : `\n${failures} pair(s) failed.`
)
process.exit(failures === 0 ? 0 : 1)
