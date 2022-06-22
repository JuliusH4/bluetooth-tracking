import { Position } from "./position";

export class Distance {
    public start: Position;
    public end: Position;

    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
    }

    length(): number {
        return this.start.distanceTo(this.end)
    }

    partialPoint(scale: number): Position {
    // returns a point beteween start and end defined by the scale parameter
        const deltaX = this.end.x - this.start.x
        const deltaY = this.end.y - this.end.y
        const x = this.start.x + (scale * deltaX)
        const y = this.start.y + (scale * deltaY)
        return new Position(x, y);
    }

    getGradient(): number {
    // geman: Steigung
        const deltaX = this.end.x - this.start.x
        const deltaY = this.end.y - this.start.y
        if (deltaX === 0) {
            return 0
        }
        return deltaY / deltaX;
    }


}

