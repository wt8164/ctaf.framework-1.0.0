import { Injectable } from '@angular/core';
import { ServiceBase } from './servicebase';

declare var CTAFShell: any;

@Injectable()
export class UsbKeyService extends ServiceBase {
    public usbKey: any = {};

    constructor() {
        super();

        if (typeof CTAFShell !== 'undefined' && !!CTAFShell.USBKey) {
            this.usbKey = CTAFShell.USBKey;
        }
    }
}
