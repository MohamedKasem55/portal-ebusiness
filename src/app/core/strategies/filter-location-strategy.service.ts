import {Injectable} from '@angular/core';
import {PathLocationStrategy} from '@angular/common';

@Injectable()
export class FilterLocationStrategy extends PathLocationStrategy {

    //TODO issue with refresh redirect to home
    prepareExternalUrl(internal: string): string {
        let url = internal;

        if(!internal.startsWith('/#') && !internal.startsWith('/redirect')){
            url = this.getBaseHref() + '#' + internal;
        }

        return url;
    }

}