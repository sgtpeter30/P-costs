import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'form-array-builder',
  templateUrl: 'form-array-builder.component.html'
})

export class FormArrayBuilder implements OnInit {
  @Input()
  formArray: FormArray

  constructor() { }

  ngOnInit() { }
}
