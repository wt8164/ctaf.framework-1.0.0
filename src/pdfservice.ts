import { Injectable } from '@angular/core';
import { ServiceBase } from './servicebase';

@Injectable()
export class PdfService extends ServiceBase {
    constructor() {
        super();
    }

    preview(pdfUrl: string) {
        window.open(pdfUrl);
    }
}
