import { Component } from "@angular/core";

@Component({
    selector: 'app-load-spinner',
    template: '<div class="lds-dual-ring"></div>',
    styleUrls: ['./load-spinner.component.css'],
    standalone: false
})
export class LoadSpinnerComponent {}
