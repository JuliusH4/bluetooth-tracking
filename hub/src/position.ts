
export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(position: Position): number {
        const distX = position.x - this.x;
        const distY = position.y - this.y;
        return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    }
}