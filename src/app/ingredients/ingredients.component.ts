import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IngredientTypeTax, IngredientTypeVolume } from '../models/dictionaries';
import { InvoiceGroup } from '../models/db-model';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class IngredientsComponent implements OnInit{
  url: string = 'http://localhost:3000/invoiceList';
  ingredientTypeVolume = IngredientTypeVolume;
  ingredientTypeTax = IngredientTypeTax;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
  ){

  }



  ingredientsList = this.fb.array([
    this.createIngredientFormGroup()
  ]);
  invoiceGroup = this.fb.group({
    date: '',
    company: '',
    ingredientsList: this.ingredientsList
  });
  invoiceList = this.fb.array([this.invoiceGroup]);
  invoiceForm = this.fb.group({
    invoiceList: this.invoiceList
  })

  ngOnInit(){
    // this.invoiceList.push(this.invoiceGroup)
    // this.activeRoute.data.subscribe((res) => {
    //   console.log("wtf");

    //   // console.log(res);
    // })
  }

  createIngredientFormGroup(data?: InvoiceGroup){
    return this.fb.group({
      ingredientName: '',
      ingredientQuantity: '',
      ingredientTypeVolume: '',
      pricesPerYear: this.fb.group({
        ingredientYear: '',
        ingredientPriceNet: [''],
        ingredientTax: [''],
        ingredientPriceGross: [''],
      }),
    })
  }

  addIngredientGroup(){
    this.ingredientsList.push(this.createIngredientFormGroup());
  }
  submitApplication() {
    // przerobić form
    // this.http.post(this.url, this.invoiceForm.value.invoiceList).subscribe()
  }


}
