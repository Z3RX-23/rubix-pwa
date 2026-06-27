export interface CubeViewOptions {
  alg: string
  size?: number
  arrows?: string
  case?: string
  view?: 'plan' | 'flat'
}

export interface ArrowDef {
  s1: string
  s2: string
  s3?: string
  scale?: number
  influence?: number
  color?: string
}
