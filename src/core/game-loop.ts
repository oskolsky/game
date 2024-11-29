import CanvasManager from '@/core/canvas-manager'
import MapManager from '@/core/map-manager'

export default class GameLoop {
    private canvasManager: CanvasManager
    private mapManager: MapManager
    private lastTime: number = 0

    constructor() {
        this.canvasManager = new CanvasManager()
        this.mapManager = new MapManager(this.canvasManager, { row: 15, cell: 15 }, true)
        this.start()
    }

    private start(): void {
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

        // Future game logic can be implemented here.
    }

    private render(): void {
        this.canvasManager.clear()
        this.mapManager.drawMap()
    }
}
