import type { STATES } from "./consts"

export interface CanvasProps {
  width: number
  height: number
  color: string
}

export interface Node {
  x: number
  y: number
  r: number
  currentR: number
  vx: number
  vy: number
  id: string
  color: string
  isDragging?: boolean
  offsetX?: number
  offsetY?: number
}

export interface Edge {
  a: string
  b: string
  restLength: number
}

export interface NodesMap {
  [id: string]: Node
}

type States = keyof typeof STATES

