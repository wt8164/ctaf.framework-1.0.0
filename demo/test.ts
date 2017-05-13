import { Component, OnInit, CTAFComponent, ChangeDetectorRef } from '../src/entry';
import { ComponentBase, Input } from '../src/entry';
import { Message, MessageService } from '../src/entry';

@Component({
    selector: 'ctaf-test',
    template: `
        <div style='color:blue'><ng-content></ng-content></div>
    `
})
export class TestComponent extends ComponentBase {
    constructor() {
        super();
    }

    @Input()
    test: string;


}

@CTAFComponent({
    selector: 'ctaf-test2',
    template: `
        <div style='color:yellow' [ngClass]="test"><ng-content></ng-content><ctaf-test3 #test3></ctaf-test3></div>
    `
})
export class Test2Component extends ComponentBase {
    public cd: ChangeDetectorRef;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);

        this.messageService.received.subscribe((message: Message) => {
            console.log(message);
        });

        this.cd = cdr;
    }

    @Input()
    test: string;
}

@CTAFComponent({
    selector: 'ctaf-test3',
    template: `
        <input type=text [(ngModel)]="test">{{test}}
    `
})
export class Test3Component extends ComponentBase {
    public cd: ChangeDetectorRef;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);

        this.cd = cdr;
    }

    @Input()
    test: string = '222';
}
