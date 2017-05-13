import {  NgModule, ChangeDetectorRef } from '@angular/core';

import { ComponentBase } from './componentbase';

/**
 * 页面跟组件基类。
 */
export class PageBase extends ComponentBase {
    constructor(protected cdr?: ChangeDetectorRef) {
        super(cdr);
    }
}
