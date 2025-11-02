import { CANVAS_PROPS, PHYSICS } from "../consts";
import type { Edge, NodesMap } from "../types";

export default function updatePhysics(nodes: NodesMap, edges: Edge[], dt: number) {
  const WIDTH = CANVAS_PROPS.width
  const HEIGHT = CANVAS_PROPS.height
  const stiffness = PHYSICS.stiffness
  const damping = PHYSICS.damping
  const restitution = PHYSICS.restitution

  const nodesArr = Object.values(nodes)

  for (const edge of edges) {
    const a = nodes[edge.a]
    const b = nodes[edge.b]
    if (!a || !b) continue

    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.hypot(dx, dy) || 1
    const diff = dist - edge.restLength
    const force = stiffness * diff

    const fx = (dx / dist) * force
    const fy = (dy / dist) * force

    a.vx += fx * dt
    a.vy += fy * dt
    b.vx -= fx * dt
    b.vy -= fy * dt
  }

  for (const node of nodesArr) {
    if (node.currentR < node.r) {
      const diff = node.r - node.currentR
      node.currentR += diff * 0.1
    }

    if (!node.isDragging) {
      node.x += node.vx * dt * 60
      node.y += node.vy * dt * 60
      node.vx *= damping
      node.vy *= damping

      if (node.x - node.currentR < 0 || node.x + node.currentR > WIDTH) {
        node.vx *= -restitution
        node.x = Math.max(node.currentR, Math.min(WIDTH - node.currentR, node.x))
      }
      if (node.y - node.currentR < 0 || node.y + node.currentR > HEIGHT) {
        node.vy *= -restitution
        node.y = Math.max(node.currentR, Math.min(HEIGHT - node.currentR, node.y))
      }
    }
  }

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

        const impulse = (-(1 + restitution) * dot) / 2
        a.vx -= impulse * nx
        a.vy -= impulse * ny
        b.vx += impulse * nx
        b.vy += impulse * ny
      }
    }
  }

}
