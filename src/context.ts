import { Injector, Compiler, Injectable, Inject, forwardRef } from '@angular/core';
import { MessageService } from './messageservice';
import { LogService } from './logservice';
import { PdfService } from './pdfservice';
import { PrintService } from './printservice';
import { UsbKeyService } from './usbkeyservice';
import { ClientStorageService } from './clientstorageservice';
import { NotificationService } from './notification/notification.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


let __CTAF_FRAMEWORK_CONTEXT__: Context;

declare let CTAFShell: any;

@Injectable()
export class Context {
    private _language = new BehaviorSubject<string>('zh');

    language$ = this._language.asObservable();

    set language(l: string) {
        this._language.next(l);
    }
    get language(){
        return this._language.getValue();
    }

    public ctafShell: any;
    /**
     * 后台 http 服务地址。
     */
    // public httpServiceDomain: string = 'http://cut.chinamoney.com.cn';
    public httpServiceDomain: string = '';
    /**
     * 后台 websocket 服务地址。
     */
    // public wsServiceDomain: string = 'http://ws.cut.chinamoney.com.cn';
    public wsServiceDomain: string = '';

    constructor(
        public messageService: MessageService,
        public injector: Injector,
        public logService: LogService,
        public pdfService: PdfService,
        public printService: PrintService,
        public usbkeyService: UsbKeyService,
        public clientStorageService: ClientStorageService,
        @Inject(forwardRef(() => NotificationService)) public notificationService: NotificationService,// tslint:disable-line
        public compiler: Compiler
    ) {
        if (!__CTAF_FRAMEWORK_CONTEXT__) {
            __CTAF_FRAMEWORK_CONTEXT__ = this;

            if (typeof CTAFShell !== 'undefined') {
                this.ctafShell = CTAFShell;
                // 如果应用承载在 CTAFShell 中，且Shell 中配置了 HttpServiceDomain 参数，则使用 Shell 中的配置替换本地配置。
                if (typeof this.ctafShell.HttpServiceDomain !== 'undefined') {
                    this.httpServiceDomain = this.ctafShell.HttpServiceDomain;
                }
                if (typeof this.ctafShell.WSServiceDomain !== 'undefined') {
                    this.wsServiceDomain = this.ctafShell.WSServiceDomain;
                }
            }
        }
    }

    public static get instance(): Context {
        return __CTAF_FRAMEWORK_CONTEXT__;
    }
}
