export type MapShift = { x: number; y: number }

export type TileString = string

export type TerrainMatrix = TileString | null[][]
export type ObjectsMatrix = TileString | null[][]

export type SpriteConfig = {
    width: number
    height: number
}

export type ParsedTile = {
    name: string
    x: number
    y: number
    width: number
    height: number
}
