import { EDGE_PROPERTIES, NODE_PROPERTIES, STATES } from "../consts"
import type { RefObject } from "react"
import type { NodesMap, Edge, Node, States } from "../types"

export default function addElement(e: React.MouseEvent<HTMLCanvasElement>,
  state: States,
  canvas: HTMLCanvasElement | null,
  nodes: NodesMap,
  edges: Edge[],
  selected: RefObject<string | null>) {
  if (!canvas) return
  const { top, left } = canvas.getBoundingClientRect()
  const x = e.clientX - left
  const y = e.clientY - top
  switch (state) {
    case STATES.ADD_EDGES: {
      const nodesArr = Object.values(nodes)
      for (const node of nodesArr) {
        const dx = node.x - x
        const dy = node.y - y
        const dist = Math.hypot(dx, dy)
        if (dist < node.currentR) {
          if (selected.current === null) {
            selected.current = node.id
            return
          }
          if (selected.current === node.id) return

          const newEdge: Edge = {
            a: selected.current,
            b: node.id,
            restLength: EDGE_PROPERTIES.restLength,
          }
          edges.push(newEdge)
          selected.current = null
          return
        }
      }
      break
    }
    case STATES.ADD_NODES: {
      const idx = Math.floor(Math.random() * NODE_PROPERTIES.colors.length)
      const color = NODE_PROPERTIES.colors[idx]
      const newNode: Node = {
        x,
        y,
        r: NODE_PROPERTIES.r,
        currentR: 0,
        vx: 0,
        vy: 0,
        id: crypto.randomUUID(),
        color
      }

      const nodesArr = Object.values(nodes)
      for (const node of nodesArr) {
        const dx = node.x - newNode.x
        const dy = node.y - newNode.y
        if (Math.hypot(dx, dy) <= newNode.r + node.r) return
      }

      nodes[newNode.id] = newNode
      break
    }

    default:
      break
  }
}
