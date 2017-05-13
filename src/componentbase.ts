
import {
    Component, OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit
    , AfterViewChecked, OnDestroy, ViewContainerRef, ComponentFactory, ViewChild, ChangeDetectorRef
    , Input, Injectable, ChangeDetectionStrategy, HostBinding, NgModule, Injector, SimpleChanges
    , ComponentRef
} from '@angular/core';

import { PageService } from './pageservice';
import { MessageService } from './messageservice';
import { NotificationService } from './notification/notification.service';
import { Log, LogService } from './logservice';
import { PdfService } from './pdfservice';
import { PrintService } from './printservice';
import { UsbKeyService } from './usbkeyservice';
import { ClientStorageService } from './clientstorageservice';

import { Context } from './context';

import * as _ from 'underscore';

/**
 * 控件尺寸
 */
export enum Size {
    /**
     * 最小
     */
    xs = 0,
    /**
     * 小号
     */
    sm = 1,
    /**
     * 默认
     */
    md = 2,
    /**
     * 大号
     */
    lg = 3
}

/**
 * 
 */
export interface ISize {

}

/**
 * @class
 * 
 * CTAF Framework 控件基类。
 * 
 * ### 继承使用示例
 * 
 * ```
 * import {ComponentBase} from 'ctaf_framework';
 * @Component({
 *   selector: 'ctaf-cp-child',
 *   template: '<div>ComponentBase child.</div>'
 * })
 * export class ChildComponent extends ComponentBase {
 *  protected get typeName(): string {
 *       return "ChildComponent";
 *  }
 *  
 *  constructor() { 
 *      super();
 *  }
 * }
 * ```
 * 
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentBase implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked { // tslint:disable-line
    // public static injector: Injector;
    protected logService: LogService;
    protected pdfService: PdfService;
    protected printService: PrintService;
    protected usbKeyService: UsbKeyService;
    protected clientStorageService: ClientStorageService;

    protected messageService: MessageService;
    protected injector: Injector;
    protected notificationService: NotificationService;
    public componentRef: ComponentRef<any>;

    private static index: number = 0;
    /**
     * 控件在页面全局的唯一 ID。
     * 由 `控件类型名称` + `控件全局自增编号` 组成。
     * 
     * ```typescript
     * this.cid = `${this.typeName}_${ComponentBase.index++}`; 
     * ```
     */
    public cid: string = '';

    protected _destroyed: boolean = false;
    public get destroyed() {
        return this._destroyed;
    }

    public destroy() {
        if (!this._destroyed) {
            if (this.componentRef) {
                this.componentRef.destroy();
            }

            this._destroyed = true;
        }
    }


    // public static messageService: MessageService;
    // public static notificationService: NotificationService;

    public context: Context = Context.instance;

    /**
     * @protected
     * 
     * 控件类型名称，需要每个实现的子类进行自定义。
     */
    protected get typeName(): string {
        return 'ComponentBase';
    }
    /**
     * @protected
     * 
     * 获取控件样式集合。
     */
    protected get classes(): any {
        return this.classesMap();
    }

    @Input()
    protected customClass: string = '';
    @Input()
    protected customHostClass: string = '';

    protected hostClassesMap(): any {
        return {
            'ctaf-cp': true,
            [this.customHostClass]: true
        };
    }

    @HostBinding('class')
    protected get hostClasses(): string {
        let r: string = '';
        _.each(this.hostClassesMap(), (v, k) => {
            if (v) {
                r += ' ' + k;
            }
        });

        return r;
    }

    /**
     * @constructor
     */
    constructor(protected cdr?: ChangeDetectorRef) {
        // 生成 cid。
        this.cid = `${this.typeName}_${ComponentBase.index++}`;
        // console.log(`this.cid = ${this.cid}`);

        this.injector = Context.instance.injector;
        this.messageService = Context.instance.messageService;
        this.logService = Context.instance.logService;
        this.notificationService = Context.instance.notificationService;
        this.pdfService = Context.instance.pdfService;
        this.printService = Context.instance.printService;
        this.usbKeyService = Context.instance.usbkeyService;
        this.clientStorageService = Context.instance.clientStorageService;
    }

    /**
     * @protected
     * 
     * 控件样式集合重载方法。
     */
    protected classesMap(): any {
        return {
            [this.customClass]: true
        };
    }

    /**
     * 设置属性值并调用修改检查方法。如果属性值没有发生过变化，则不进行赋值和修改检查调用。
     * 值发生改变，返回 true，否则返回 false。
     */
    protected setProperty(name: string, value: any): boolean {
        if (value === this[name]) {
            return false;
        }
        this[name] = value;
        return this.forceChange();
    }

    public forceChange() {
        if (this.cdr) {
            this.cdr.reattach();
            this.cdr.detectChanges();
        }
        return true;
    }
    /**
     * 动态增加子控件。
     * 
     * 
     */
    protected addChild(container: ViewContainerRef, template: string, module?: any) {
        @Component({
            selector: 'ctaf-dynamic-component',
            template: template,
        })
        class DynamicComponent extends ComponentBase {
            @ViewChild('component')
            component: any;
        };

        @NgModule({
            imports: [module],
            declarations: [
                DynamicComponent
            ]
        })
        class RuntimeComponentModule {
        };

        return new Promise<ComponentBase>((resolve, reject) => {
            Context.instance.compiler.compileModuleAndAllComponentsAsync(RuntimeComponentModule)
                .then((moduleWithFactories) => {
                    let factory = _.find(moduleWithFactories.componentFactories
                        , { componentType: DynamicComponent });
                    // ComponentBase.abc = factory;
                    let componentRef = container.createComponent(factory, container.length);
                    // and here we have access to our dynamic component
                    let component = (<any>componentRef.instance).component;
                    if (component) {
                        component.componentRef = componentRef;
                        component.forceChange();
                    }
                    resolve(component);
                })
                .catch((reason) => {
                    reject(reason);
                });
        });

    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
    }

    ngAfterContentChecked() {
    }

    ngAfterViewInit() {
    }

    ngAfterViewChecked() {
    }

    ngOnDestroy() {
    }
}

