import {
    Component, OnInit, ComponentBase, Compiler, ViewContainerRef, newGuid, ComponentFactory, ComponentRef,
    ViewChild, PageService, Injector, ElementRef, ChangeDetectorRef, CTAFComponent, Input, ChangeDetectionStrategy,
    Http, NgModule, forwardRef, CommonModule, FormsModule, Message
} from '../src/entry';

import { TestComponent, Test2Component } from './test';


@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [ Test2Component ],
    exports: [ Test2Component ]
})
class Test2Module {

}


@NgModule({
    declarations: [ TestComponent ],
    exports: [ TestComponent ]
})
class TestModule {

}

@CTAFComponent({
    selector: 'ctaf-panelchild',
    template: '<div>panel child</div>'
})
export class PanelChildComponent extends ComponentBase {
    protected get typeName(): string {
        return 'PanelChildComponent';
    }
    constructor() {
        super();
    }
}

@CTAFComponent({
    selector: 'ctaf-panel',
    template: `
        <div>
            <div>{{title}} - {{customClass}}</div>
            <ng-content></ng-content><span style="color: red">Cross</span>
            <div #dynamicContentPlaceHolder></div>
        </div>
    `
})
export class PanelComponent extends ComponentBase {
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef })
    holder: ViewContainerRef;

    protected get typeName(): string {
        return 'PanelComponent';
    }

    private _title: string = '';
    @Input()
    set title(v: string) {
        this.setProperty('_title', v);
    }
    get title(): string {
        return this._title;
    }

    constructor(
        protected cdr: ChangeDetectorRef,
        private element: ViewContainerRef,
        // private children: ViewChildren,
        private compiler: Compiler,
        protected elementRef: ElementRef,
        private http: Http
    ) {
        super(cdr);
        (<any>window).panel = this;
        this.messageService.received.subscribe((message) => {
            // alert(message);
        });

        
        this.messageService.On('pagetest', (message: Message) => {
            console.log(message);
        });
    }

    ngOnInit() {
        console.warn(this.cdr);
    }

    ngAfterViewInit() {

    }

    ngAfterViewChecked() {
    }

    add() {
        // let f = this.compiler.compileComponentSync(PanelChildComponent);
        // this.element.createComponent(f);

    }

    public iCount: number = 1;


    public createChild() {
        this.iCount++;

        let template = `<ctaf-test #component>abc${this.iCount}</ctaf-test>`;


        this.addChild(this.holder, template, TestModule).then((c: TestComponent) => {
            console.log(c);

            c.test = '1';
        });
    }


    public createChild2() {
        this.iCount++;

        let template = `<ctaf-test2 #component>abc${this.iCount}</ctaf-test2>`;


        this.addChild(this.holder, template, Test2Module).then((c: Test2Component) => {
            console.log(c);

            c.test = '1';
        });
    }

    close() {
        this.element.remove();
    }

}
