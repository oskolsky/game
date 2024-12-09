import { CharacterAction, CharacterDirection } from '@/utils/enums'

type CharacterConfig = {
    size: {
        width: number
        height: number
    }
    actionFrames: Record<CharacterAction, number[]>
    directionFrame: Record<CharacterDirection, number>
    frameSpeed: Record<CharacterAction, number>
}

export const characterConfig: CharacterConfig = {
    size: {
        width: 128,
        height: 128,
    },
    actionFrames: {
        [CharacterAction.Base]: [0, 128, 256, 384],
        [CharacterAction.Run]: [512, 640, 768, 896, 1024, 1152, 1280, 1408],
        [CharacterAction.Attack]: [1536, 1664, 1792, 1920, 2048],
        [CharacterAction.Lose]: [2432, 2560, 2688, 2816, 2944, 3072],
        [CharacterAction.Win]: [3200, 3328, 3456, 3584, 3712, 3840, 3968],
    },
    directionFrame: {
        [CharacterDirection.W]: 0,
        [CharacterDirection.NW]: 128,
        [CharacterDirection.N]: 256,
        [CharacterDirection.NE]: 384,
        [CharacterDirection.E]: 512,
        [CharacterDirection.SE]: 640,
        [CharacterDirection.S]: 768,
        [CharacterDirection.SW]: 896,
    },
    frameSpeed: {
        [CharacterAction.Base]: 0.075,
        [CharacterAction.Run]: 0.2,
        [CharacterAction.Attack]: 0.15,
        [CharacterAction.Lose]: 0.1,
        [CharacterAction.Win]: 0.1,
    },
}
