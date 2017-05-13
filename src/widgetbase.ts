import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

import { ComponentBase } from './componentbase';
import { TranslateService } from './i18next/translateservice';
import { CTAFComponent } from './component.decorator';

import * as _ from 'underscore';

/**
 * WidgetBase，CTAF Widget 基类。
 */
@CTAFComponent({})
export class WidgetBase extends ComponentBase {

    @Input() x: number;
    @Input() y: number;
    @Input() w: number = 1;
    @Input() h: number = 1;

    /**
     * Widget的名称，每个 Widget 需要手动实现。
     */
    public static get widgetTitle(): string {
        return 'WidgetBase';
    }
    /**
     * Widget 描述。
     */
    public static get description(): string {
        return '';
    }

    constructor(protected cdr?: ChangeDetectorRef, protected translateservice?: TranslateService) {
        super(cdr);
        if (this.translateservice) {
            this.translateservice.init(this, this.locales());

            this.context.language$.subscribe((v) => {
                this.translateservice.changeLanguage(this, v);
            });
        }
    }

    /**
     * Widget 的模板字符串，用于动态添加时使用。
     */
    public static getTemplate(): string {
        return '';
    }

    protected locales() {
        return {
            zh: {},
            en: {}
        };
    }

    protected hostClassesMap(): any {
        return _.extend(super.hostClassesMap(), {
            'ctaf-wg': true
        });
    }
}
