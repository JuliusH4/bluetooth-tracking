import { Position } from "./position";


export class LotStraight {
    public m: number;
    public point: Position

    constructor(m: number , point: Position) { // y = mx +a
        this.m = m;
        this.point = point;
    }

    getIntersection(straight: LotStraight): Position {
        // index 0 is straight of this object, index 1 is straight passed as parameter
        // basic lot straight y = -(1/m0)(x-x0)+y0
        const y0 = this.point.y
        const y1 = straight.point.y
        const m0 = this.m
        const m1 = straight.m
        const x0 = this.point.x
        const x1 = straight.point.x
        const x = -y0+ y1+ (((m0*x1)-x0*m1)/(m0*m1))*((m0*m1)/(m0-m1));
        const y = -(1/m0)*(x-x0)+y0
        console.log(x, y)
        return new Position(x, y)
    }

}