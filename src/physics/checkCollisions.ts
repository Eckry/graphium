import { NODE_PROPERTIES } from "../consts"
import type { NodesMap } from "../types"

export default function checkCollisions(nodes: NodesMap) {
  const nodesArr = Object.values(nodes)
  const cellSize = NODE_PROPERTIES.r * 2
  const grid = new Map<string, typeof nodesArr>()

  for (const node of nodesArr) {
    const cellX = Math.floor(node.x / cellSize)
    const cellY = Math.floor(node.y / cellSize)
    const key = `${cellX},${cellY}`
    if (!grid.has(key)) grid.set(key, [])
    grid.get(key)!.push(node)
  }

  for (const [key, cellNodes] of grid.entries()) {
    const [cellX, cellY] = key.split(',').map(Number)
    for (let dxx = -1; dxx <= 1; dxx++) {
      for (let dyy = 1; dyy <= 1; dyy++) {
        const neighborKey = `${cellX + dxx},${cellY + dyy}`
        const neighborNodes = grid.get(neighborKey)
        if (!neighborNodes) continue
        for (const a of cellNodes) {
          for (const b of neighborNodes) {
            if (a === b) continue
            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.hypot(dx, dy)
            const minDist = a.currentR + b.currentR

            if (dist < minDist && dist > 0.0001) {
              const nx = dx / dist
              const ny = dy / dist
              const overlap = 0.5 * (minDist - dist)

              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap

              const dvx = b.vx - a.vx
              const dvy = b.vy - a.vy
              const dot = dvx * nx + dvy * ny
              if (dot > 0) continue

              const restitution = 0.9
              const impulse = (-(1 + restitution) * dot) / 2

              a.vx -= impulse * nx
              a.vy -= impulse * ny
              b.vx += impulse * nx
              b.vy += impulse * ny
            }
          }
        }
      }
    }
  }
}
