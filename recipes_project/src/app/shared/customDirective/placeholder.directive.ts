import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector : "[apppplaceholder]"
})
export class PlaceholderDirective{
    constructor(public viewContainerRef : ViewContainerRef){}
}