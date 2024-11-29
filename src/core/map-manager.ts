import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'

import { assets } from '@/assets/assets'
import { buildingMatrix, matrix, tile } from '@/core/tiles'

export default class MapManager {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private center: { row: number; cell: number }
    private skeleton: boolean = false
    private hoveredTile: { row: number; cell: number } | null = null
    private assetManager: AssetManager

    private tileImage: HTMLImageElement | undefined
    private selectTileImage: HTMLImageElement | undefined
    private buildingImage: HTMLImageElement | undefined
    private treeImage: HTMLImageElement | undefined

    constructor(canvasManager: CanvasManager, center: { row: number; cell: number }, skeleton: boolean) {
        this.canvas = canvasManager.getCanvas()
        this.context = canvasManager.getContext()
        this.center = center
        this.assetManager = new AssetManager()
        this.skeleton = skeleton

        // Load images
        Promise.all([
            this.assetManager.loadImage('tile', assets.tileImage),
            this.assetManager.loadImage('selectTile', assets.selectTileImage),
            this.assetManager.loadImage('building', assets.buildingImage),
            this.assetManager.loadImage('tree', assets.treeImage),
        ]).then(([tileImage, selectTileImage, buildingImage, treeImage]) => {
            this.tileImage = tileImage
            this.selectTileImage = selectTileImage
            this.buildingImage = buildingImage
            this.treeImage = treeImage
            this.drawMap()
        })

        // Set up event listeners for hover and click
        this.canvas.addEventListener('mousemove', event => this.handleHover(event))
        this.canvas.addEventListener('click', event => this.handleClick(event))
    }

    /**
     * Calculates the tile based on the coordinates in isometric projection.
     * Returns null if the coordinates are outside the map.
     */
    private getCellByCoordinates(x: number, y: number): { row: number; cell: number } | null {
        const centerMap = this.getCoordinatesByCell(this.center.row, this.center.cell)
        const screenCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

        // Adjust screen coordinates relative to the map center
        const adjustedX = x - screenCenter.x + centerMap.x
        const adjustedY = y - screenCenter.y + centerMap.y - 1

        // Calculate row and cell based on isometric transformation
        const row = Math.floor((adjustedY / tile.height_half - adjustedX / tile.width_half) / 2)
        const cell = Math.floor((adjustedY / tile.height_half + adjustedX / tile.width_half) / 2)

        // Check if the row and cell are within the bounds of the map matrix
        if (row >= 0 && row < matrix.length && cell >= 0 && cell < matrix[row].length) {
            return { row, cell }
        }

        // Return null if the click/hover is outside the map
        return null
    }

    public drawMap(): void {
        this.drawTileMap()
        this.drawBuilding()
    }

    /**
     * Draws the tile map on the canvas.
     */
    public drawTileMap(): void {
        if (!this.tileImage) return // Wait until the tile image is loaded

        const centerMap = this.getCoordinatesByCell(this.center.row, this.center.cell)
        const screenCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

        // Iterate through the map matrix and draw each tile
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                const x = (col - row) * tile.width_half + screenCenter.x - centerMap.x
                const y = (col + row) * tile.height_half + screenCenter.y - centerMap.y

                // Determine if the tile is being hovered
                const isHovered = !!(this.hoveredTile && this.hoveredTile.row === row && this.hoveredTile.cell === col)

                this.drawTile(x, y, isHovered)

                if (this.skeleton) {
                    this.drawSkeleton(x, y, `${row},${col}`)
                }
            }
        }

        // Draw a debug point at the center of the screen
        this.drawDebugPoint(screenCenter.x, screenCenter.y)
    }

    public drawBuilding(): void {
        const centerMap = this.getCoordinatesByCell(this.center.row, this.center.cell)
        const screenCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

        // Iterate through the map matrix and draw each tile
        for (let row = 0; row < buildingMatrix.length; row++) {
            for (let col = 0; col < buildingMatrix[row].length; col++) {
                const x = (col - row) * tile.width_half + screenCenter.x - centerMap.x
                const y = (col + row) * tile.height_half + screenCenter.y - centerMap.y

                const tileType = buildingMatrix[row][col]

                if (tileType === 1 && this.buildingImage) {
                    this.context.drawImage(
                        this.buildingImage,
                        x - this.buildingImage.width / 2,
                        y - this.buildingImage.height + tile.height,
                        this.buildingImage.width,
                        this.buildingImage.height,
                    )
                }

                if (tileType === 2 && this.treeImage) {
                    this.context.drawImage(
                        this.treeImage,
                        x - this.treeImage.width / 2,
                        y - this.treeImage.height + tile.height,
                        this.treeImage.width,
                        this.treeImage.height,
                    )
                }
            }
        }

        // Draw a debug point at the center of the screen
        this.drawDebugPoint(screenCenter.x, screenCenter.y)
    }

    /**
     * Draws a tile at the specified position.
     */
    private drawTile(x: number, y: number, isHovered: boolean): void {
        const tileImage = this.tileImage

        // Draw the tile image in the appropriate position
        if (tileImage) {
            this.context.drawImage(tileImage, x - tile.width_half, y, tile.width, tile.height)
        }

        if (isHovered && this.selectTileImage) {
            this.context.drawImage(this.selectTileImage, x - tile.width_half, y, tile.width, tile.height)
        }
    }

    /**
     * Draws a skeleton of the tile at the specified position.
     */
    private drawSkeleton(x: number, y: number, caption: string): void {
        // Set the fill color to green for regular tiles
        this.context.strokeStyle = '#fff'
        this.context.beginPath()
        this.context.moveTo(x, y)
        this.context.lineTo(x + tile.width_half, y + tile.height_half)
        this.context.lineTo(x, y + tile.height)
        this.context.lineTo(x - tile.width_half, y + tile.height_half)
        this.context.closePath()
        this.context.stroke()

        // Draw the caption in the center of the tile (for debugging)
        this.context.fillStyle = 'white'
        this.context.font = '10px Arial'
        this.context.fillText(caption, x - 7, y + tile.height_half + 3)
    }

    /**
     * Handles hover event on the canvas.
     */
    private handleHover(event: MouseEvent): void {
        const { x, y } = event
        const cell = this.getCellByCoordinates(x, y)

        if (cell) {
            this.hoveredTile = cell
            this.drawMap() // Redraw map with hover effect
        } else {
            this.hoveredTile = null // Reset hover if outside the map
        }
    }

    /**
     * Handles click event on the canvas.
     */
    private handleClick(event: MouseEvent): void {
        const { x, y } = event
        const cell = this.getCellByCoordinates(x, y)

        if (cell) {
            console.log(`Clicked tile coordinates: row ${cell.row}, cell ${cell.cell}`)
        } else {
            console.log('Clicked outside the map')
        }
    }

    /**
     * Draws a point at a specific location for debugging purposes.
     */
    private drawDebugPoint(x: number, y: number): void {
        this.context.fillStyle = 'red'
        this.context.beginPath()
        this.context.arc(x, y, 5, 0, 2 * Math.PI)
        this.context.closePath()
        this.context.fill()
    }

    /**
     * Converts row and cell to screen coordinates.
     */
    private getCoordinatesByCell(rowNumber: number, cellNumber: number): { x: number; y: number } {
        const x = (cellNumber - rowNumber) * tile.width_half
        const y = (cellNumber + rowNumber) * tile.height_half + tile.height_half

        return { x, y }
    }
}
