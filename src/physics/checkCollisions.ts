import type { NodesMap } from "../types"

export default function checkCollisions(nodes: NodesMap) {
  const nodesArr = Object.values(nodes)
  for (let i = 0; i < nodesArr.length; i++) {
    for (let j = i + 1; j < nodesArr.length; j++) {
      const a = nodesArr[i]
      const b = nodesArr[j]

      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const minDist = a.currentR + b.currentR

      if (dist < minDist) {
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
