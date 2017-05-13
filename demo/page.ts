import {
    NgModule, Component, OnInit, PageBase, PageService, Inject,
    ElementRef, ViewChild, ViewChildren, OnChanges,
    CTAFComponent, ChangeDetectorRef, ComponentBase
} from '../src/entry';
import { MessageService, Message } from '../src/entry';
import { BackendService, BackendServiceOptions, ResponseContentType, BodyType } from '../src/entry';
import { NotificationService, NotificationConfig } from '../src/entry';
import { PanelComponent, PanelChildComponent } from './panel';

import { Test2Component, Test3Component } from './test';

import { Context } from '../src/entry';

@CTAFComponent({
    selector: 'ctaf-page',
    templateUrl: 'page.component.html',
})
export class PageComponent extends PageBase {
    public aValue = [];

    @ViewChild(PanelComponent)
    public panel1: PanelComponent;

    @ViewChild(Test2Component)
    public test2: Test3Component;

    public checked: boolean = true;

    public as: Array<any> = [{
        id: 1,
        checked: true
    },
    {
        id: 2,
        checked: true
    }];
    checkboxChange(e) {
        // console.log(e.target.checked);
        console.log(e);
    }

    panelTitle = '';

    constructor(cdr: ChangeDetectorRef, private backendService: BackendService) {
        super(cdr);

    }

    ngOnInit() {
        (<any>window).test2 = this;

        this.aValue.push('1');
        this.aValue.push('2');

        this.messageService.received.subscribe((message: Message) => {
            console.log('Received Message');
            console.log('message.subject = ' + message.subject);
            console.log(message.message);
            if (message.subject === '/meta/handshake') {
                console.log(message.message);
                this.notificationService.subscribe('/cometd', '/chat/demo',
                    (url, data) => {
                        console.log((data));
                    });
                this.notificationService.subscribe('/cometd', '/members/demo',
                    (url, data) => {
                        console.log((data));
                    });
            }
        });

        // ws://127.0.0.1:8080
        // http://localhost:8000
        // http://ctaf.southeastasia.cloudapp.azure.com
        Context.instance.httpServiceDomain = 'http://ctaf.southeastasia.cloudapp.azure.com';
    }

    create() {
        this.panel1.createChild();
    }

    create2() {
        this.panel1.createChild2();
    }

    changeTitle() {
        this.panelTitle = new Date().getTime().toString();
    }

    sendMessage(v) {
        this.messageService.Send('pagetest', new Message('Page', v));
    }

    aaa() {
        this.test2.test = 'abc';

        this.test2.forceChange();
    }

    selectChange() {
        console.log(this.aValue);
    }

    ajaxGet() {
        let url: string = '/index.php/api/photo';
        let options: BackendServiceOptions = new BackendServiceOptions();

        options.responseType = ResponseContentType.Json;

        let params = { name: 9527, title: 'hello world' };

        console.log('ajax');
        this.backendService.get(url, params).then(
            data => console.log(data)
        );
    }

    ajaxPost() {
        let url: string = '/index.php/api/photo';
        let options: BackendServiceOptions = new BackendServiceOptions();

        options.params = { name: 9527, title: 'hello world' };
        options.responseType = ResponseContentType.Json;

        options.requestBodyType = BodyType.Json;

        let json = { name: 'name', value: 123 };

        console.log('ajax');
        this.backendService.post(url, json).then(
            data => console.log(data)
        );
    }

    ajaxPut() {
        let url: string = '/index.php/api/photo/1234';
        let options: BackendServiceOptions = new BackendServiceOptions();

        options.params = { name: 9527, title: 'hello world' };
        options.responseType = ResponseContentType.Json;

        options.requestBodyType = BodyType.FormUrlEncoded;


        let json = { name: 'name', value: 123 };

        console.log('ajax');
        this.backendService.put(url, json, options).then(
            data => console.log(data)
        );
    }

    ajaxDelete() {
        let url: string = '/index.php/api/photo/1234';
        let options: BackendServiceOptions = new BackendServiceOptions();

        options.params = { name: 9527, title: 'hello world' };
        options.responseType = ResponseContentType.Json;

        options.requestBodyType = BodyType.FormData;

        options.json = { name: 'name', value: 123 };

        let params = { nickname: 'bb', value: 123 };

        console.log('ajax');
        this.backendService.delete(url, params, options).then(
            data => console.log(data)
        );
    }

    addListener() {
        // ComponentBase.notificationService.addListener('ws://127.0.0.1:8080/cometd','/meta/handshake'); 
        // ComponentBase.notificationService.addListener('ws://127.0.0.1:8080/cometd','/meta/connect');
    }

    webSocketConnet() {
        this.notificationService.connect('/cometd');
    }

    publish() {
        this.notificationService.publish('/cometd', '/chat/demo', {
            user: 'benson',
            membership: 'join',
            chat: 'benson' + ' has joined'
        });
    }
}

PageService.bootstrap(PageComponent, null, [PageComponent, PanelComponent, PanelChildComponent, Test2Component, Test3Component]);
