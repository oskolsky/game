import { SpriteType } from '@/utils/enums'

export const grasslandConfig: Record<SpriteType, { width: number; height: number }> = {
    trees: {
        width: 128,
        height: 256,
    },
    watter: {
        width: 64,
        height: 64,
    },
    rottentower: {
        width: 358,
        height: 358,
    },
    structures: {
        width: 64,
        height: 256,
    },
    grassland: {
        width: 64,
        height: 128,
    },
    tiledGrassland: {
        width: 128,
        height: 64,
    },
}
