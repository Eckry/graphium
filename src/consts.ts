import type { CanvasProps } from "./types.d.ts";

export const CANVAS_PROPS: CanvasProps = {
  width: 1200,
  height: 700,
  color: "#000"
}

export const PHYSICS = {
  restitution: 0.9,
  damping: 0.9,
  stiffness: 10
}

export const NODE_PROPERTIES = {
  r: 30,
  colors: ['#c4ff57', '#ffb259', '#ffa6a6', '#a6ffea', '#879dff', '#d194ff', '#ff8ae0']
}

export const EDGE_PROPERTIES = {
  restLength: 120
}


export const STATES = {
  ADD_NODES: 'ADD_NODES',
  ADD_EDGES: 'ADD_EDGES'
} as const

export const SPATIAL_HASHING = {
  cellColor: 'gray',
  strokeColor: '#212121'
}
