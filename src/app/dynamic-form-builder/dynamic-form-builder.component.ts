import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormArrayBuilder } from "./form-parts/form-array-builder/form-array-builder.component";

@Component({
    standalone: true,
    selector: 'app-dynamic-form-builder',
    templateUrl: './dynamic-form-builder.component.html',
    styleUrls: ['./dynamic-form-builder.component.scss'],
    imports: [FormArrayBuilder]
})
export class DynamicFormBuilderComponent {
  @Input()
  formDataBuilder: any;

  constructor(){
    console.log(this.formDataBuilder);
    console.log(typeof this.formDataBuilder);

  }
}
