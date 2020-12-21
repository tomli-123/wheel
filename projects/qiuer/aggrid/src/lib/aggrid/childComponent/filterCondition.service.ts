import { Injectable } from '@angular/core';

@Injectable()
export class FilterConditionService {
    constructor() { }
    // text
    public left(source: string, value: string): boolean {
        return source.indexOf(value) === 0;
    }
    public fuzzy(source: string, value: string): boolean {
        return source.indexOf(value) !== -1;
    }
    public full(source: string, value: string): boolean {
        return source === value;
    }
    public exclude(source: string, value: string): boolean {
        return source.indexOf(value) === -1;
    }

    // number
    public gtr(source: number, value: number): boolean {
        return source > value;
    }
    public less(source: number, value: number): boolean {
        return source < value;
    }
    public equ(source: number, value: number): boolean {
        return value === source;
    }
    public neq(source: number, value: number): boolean {
        return value !== source;
    }
    public leq(source: number, value: number): boolean {
        return source <= value;
    }
    public geq(source: number, value: number): boolean {
        return source >= value;
    }
}

