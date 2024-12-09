import { gameConfig } from '@/configs/game.config'
import { objectsConfig } from '@/configs/objects.config'
import { terrainConfig } from '@/configs/terrain.config'

import type { ParsedTile, SpriteConfig, TileString } from '@/utils/types'

function getTileFromSprite(tileString: TileString, config: Record<string, SpriteConfig>): ParsedTile {
    const name = tileString.split(':')[0]
    const row = parseInt(tileString.split(':')[1], 10)
    const col = parseInt(tileString.split(':')[2], 10)
    const width = config[name].width
    const height = config[name].height

    return {
        name,
        x: col * width,
        y: row * height,
        width,
        height,
    }
}

export function getTerrainTileFromSprite(tileString: TileString): ParsedTile {
    return getTileFromSprite(tileString, terrainConfig)
}

export function getObjectTileFromSprite(tileString: TileString): ParsedTile {
    return getTileFromSprite(tileString, objectsConfig)
}

export function calculateTileX(row: number, col: number): number {
    return Math.round((col - row) * gameConfig.tile.width_half)
}

export function calculateTileY(row: number, col: number): number {
    return Math.round((col + row) * gameConfig.tile.height_half)
}
