import { NgModule, Injectable, Injector, ApplicationRef, enableProdMode, OpaqueToken } from '@angular/core';
import { RuntimeCompiler, COMPILER_PROVIDERS } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ComponentBase } from './componentbase';
import { ServiceBase } from './servicebase';
import { ClientStorageService } from './clientstorageservice';
import { BackendService } from './backend.service';
import { NotificationService } from './notification/notification.service';
import { WebSocketService } from './notification/websocket.service';
import { MessageService } from './messageservice';
import { LogService } from './logservice';
import { PdfService } from './pdfservice';
import { PrintService } from './printservice';
import { UsbKeyService } from './usbkeyservice';
import { FormsModule } from '@angular/forms';
import { WidgetBase } from './widgetbase';

import { CommonModule } from '@angular/common';
import { TranslateI18NextModule } from './i18next';

import { Context } from './context';



/**
 * 页面管理服务
 * 
 * 页面管理服务在页面启动时注册到根组件下。
 */
export class PageService extends ServiceBase {
    private static _PageManagerInstance: PageService;
    private static _widgetArray: Array<any> = [];
    private static _settingWidgetArray: Array<any> = [];

    // public static appRef: ApplicationRef;
    // public static component: ComponentBase;
    // public static pageModule: any;
    // public static compiler: RuntimeCompiler;

    /**
     * 页面是否已经启动。
     */
    public static isPageBootstrap: Boolean = false;

    /**
     * 当前页面中的 PageService 实例。
     */
    public static get current(): PageService {
        if (PageService._PageManagerInstance === null) {
            console.error('页面管理服务===null');
        }
        return PageService._PageManagerInstance;
    }
    /**
     * 当前页面可以使用的 Widget 列表，在每个 Widget 代码之后主动注册到 PageService 上来。
     */
    public static get widgets(): Array<any> {
        return PageService._widgetArray;
    }

    /**
     * 当前页面可以使用的 SettingWidget 列表，在每个 SettingWidget 代码之后主动注册到 PageService 上来。
     */
    public static get settingWidgets(): Array<any> {
        return PageService._settingWidgetArray;
    }

    constructor() {
        super();
        if (PageService._PageManagerInstance != null) {
            console.error('页面管理服务在当前页面只能存在一个实例，此错误显示则表示有多次实例化。');
        } else {
            PageService._PageManagerInstance = this;
        }
    }

    /**
     * 启动页面根组件。
     * 
     * ### 示例
     * ```typescript
     * // 启动页面
     * PageService.bootstrap(pageComponent);
     * ```
     */
    static bootstrap(page: any, imports?: Array<any>, declarations?: Array<any>, providers?: Array<any>) {
        // enableProdMode();

        @NgModule({
            imports: [CommonModule, BrowserModule, FormsModule, HttpModule, TranslateI18NextModule].concat(!imports ? [] : imports),
            declarations: [page].concat(!declarations ? [] : declarations),
            bootstrap: [page],
            providers: [
                PageService,
                COMPILER_PROVIDERS,
                MessageService,
                BackendService,
                NotificationService,
                WebSocketService,
                LogService,
                PdfService,
                PrintService,
                UsbKeyService,
                ClientStorageService,
                Context
            ].concat(!providers ? [] : providers)
        })
        class PageModule {
            constructor(public context: Context) {

            }
        }
        if (PageService.isPageBootstrap) {
            return console.error('页面管理器已经启动过一个页面模块，不能重复启动。');
        }
        PageService.isPageBootstrap = true;
        platformBrowserDynamic().bootstrapModule(PageModule).then(
            (moduleRef) => {

            }, (reason) => {
                console.error(`PageService.bootstrap warning: ${reason}`);
                PageService.isPageBootstrap = false;
            });
    }

    // registerComponent<C extends ComponentBase>(component: C) {
    //     PageService.component = component;
    // }
}
