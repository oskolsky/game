import { SpriteType } from './enums'

export function getSpriteCoord(col: number, row: number, width: number, height: number): [number, number] {
    const x = col * width
    const y = row * height
    return [x, y]
}

export function parseSpriteIndex(input: string): { name: SpriteType; row: number; col: number } {
    const [name, row, col] = input.split(':')
    return {
        name: name as SpriteType,
        row: parseInt(row, 10),
        col: parseInt(col, 10),
    }
}
