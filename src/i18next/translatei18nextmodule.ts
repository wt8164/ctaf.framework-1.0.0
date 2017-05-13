import { NgModule } from '@angular/core';

import { TranslatePipe } from './translatepipe';
import { TranslateI18Next } from './translatei18next';
import { TranslateI18NextLanguagesSupport } from './translatei18nextlanguagedetector';
import { TranslateService } from './translateservice';

@NgModule({
    providers: [
        TranslateI18Next,
        TranslateI18NextLanguagesSupport,
        TranslateService
    ],
    declarations: [
        TranslatePipe
    ],
    exports: [
        TranslatePipe
    ]
})
export class TranslateI18NextModule {
}
