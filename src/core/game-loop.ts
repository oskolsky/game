import CanvasManager from '@/core/canvas-manager'
import GameManager from '@/core/game-manager'

import Loader from '@/core/loader'

export default class GameLoop {
    private canvasManager: CanvasManager
    private gameManager: GameManager

    private loader: Loader

    private lastTime: number = 0

    constructor() {
        this.canvasManager = CanvasManager.getInstance()
        this.gameManager = new GameManager()

        this.loader = Loader.getInstance()
        this.loader.onComplete(this.startGameLoop.bind(this))
        this.loader.onError(this.handleLoadingError.bind(this))
        this.loader.load()
    }

    private handleLoadingError(error: string): void {
        console.error(`Failed to load assets: ${error}`)
    }

    private startGameLoop(): void {
        const loop = (time: number) => {
            this.update(time)
            this.render()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }

    private update(time: number): void {
        const deltaTime = time - this.lastTime
        this.lastTime = time

        // TODO: Implement game logic here
    }

    private render(): void {
        this.canvasManager.clear()
        this.gameManager.render()
    }
}
