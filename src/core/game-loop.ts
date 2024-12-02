import MapManager from '@/core/map-manager'
import Loader from '@/core/loader'

export default class GameLoop {
    private mapManager: MapManager
    private loader: Loader

    constructor() {
        this.mapManager = new MapManager()

        this.loader = new Loader()
        this.loader.onComplete(this.startGameLoop.bind(this))
        this.loader.onError(this.handleLoadingError.bind(this))
        this.loader.load()
    }

    private handleLoadingError(error: string): void {
        console.error(`Failed to load assets: ${error}`)
    }

    private startGameLoop(): void {
        const loop = (time: number) => {
            this.mapManager.renderMap()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }
}
