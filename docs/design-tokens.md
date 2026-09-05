# Design Tokens — Sprint Draft v2

Flat elevation, no shadows. One chamfer, registration marks at canvas corners.

## Color Tokens — v2
```
--canvas:      #0D1A24  (page background)
--surface:     #14262F  (panel/section background)
--surface-alt: #1C2F3A  (rail / toolbar background)
--grid-line:   #2A4655  (hairline borders, dividers, graph-paper grid)
--paper:       #E8E3D4  (index-card / spec-sheet surface)
--ink:         #12181C  (text on paper)
--ink-soft:    #4B5A62  (secondary text on paper)
--bright:      #EAF1F7  (primary text on dark)
--fog:         #8FA6B5  (secondary text on dark)

Epic accent cycle — flat fills, deepened:
--amber: #C98A34
--coral: #BD5646
--teal:  #3A8078
--violet:#6E62AE
--sage:  #5F8552
```

## Type Tokens
- Space Grotesk — headings + large numeric emphasis (sprint number big)
- IBM Plex Sans — body + UI copy
- IBM Plex Mono — strictly for technical/data content: ticket IDs, points, WIP counts, timestamps, field labels

## Signature Devices
1. **Chamfer, not radius** — every panel/card/button top-right corner cut 45° via `clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)`. Only corner treatment.
2. **Registration marks** — four L-shaped corner brackets at outer canvas corners, 1px hairline in --grid-line.

## Constraints
No border-radius anywhere, no gradients anywhere, no drop-shadow elevation, no pill toggles, no circular badges, no second corner style, no generic template chrome.
