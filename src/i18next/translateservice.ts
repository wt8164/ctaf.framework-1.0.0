import { Injectable, EventEmitter, Output, OpaqueToken } from '@angular/core';
import { ComponentBase } from '../componentbase';
import { ServiceBase } from '../servicebase';

import { Subject } from 'rxjs/Subject';
import { TranslateI18Next } from './translatei18next';

import * as _ from 'underscore';

@Injectable()
export class TranslateService extends ServiceBase {
    loadLocales: Function = (url, options, callback, data) => {
        // try {
        //     let waitForLocale = require('bundle!../../locales/' + url + '.json');
        //     waitForLocale((locale) => {
        //         callback(locale, { status: '200' });
        //     })
        // } catch (e) {
        //     callback(null, { status: '404' });
        // }

        callback(this.language[url], { status: '200' });
    };

    constructor(public translateI18Next: TranslateI18Next) {
        super();
    }

    public language: any = {};

    init(c: ComponentBase, lang: any) {
        this.language = lang;

        this.translateI18Next.init({
            debug: false,
            returnEmptyString: false,
            initImmediate: true,
            backend: {
                loadPath: '{{lng}}',
                parse: (data) => data,
                ajax: this.loadLocales,
            },
            preload: ['zh', 'cn']
            // supportedLanguages: [
            //     'zh',
            //     'en'
            // ]
        }).then(() => {
            this.translateI18Next.loaded = true;
            c.forceChange();
        });
    }

    changeLanguage(c: ComponentBase, lng?: string) {
        this.translateI18Next.changeLanguage(lng, () => {
            setTimeout(() => {
                c.forceChange();
            }, 0);
        });
    }

    // public loadLocales(url, options, callback, data) {
    //     try {
    //         let waitForLocale = require('bundle!../../locales/'+url+'.json');
    //         waitForLocale((locale) => {
    //             callback(locale, { status: '200' });
    //         })
    //     } catch (e) {
    //         callback(null, { status: '404' });
    //     }
    // }
}
