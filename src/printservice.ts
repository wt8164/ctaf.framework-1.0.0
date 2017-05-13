import { Injectable } from '@angular/core';
import { ServiceBase } from './servicebase';

@Injectable()
export class PrintService extends ServiceBase {
    constructor() {
        super();
    }

    print() {
        window.print();
    }
}
