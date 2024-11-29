export default class CanvasManager {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')!

        if (!this.context) {
            throw new Error('Failed to initialize 2D canvas context.')
        }

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        document.body.appendChild(this.canvas)
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
