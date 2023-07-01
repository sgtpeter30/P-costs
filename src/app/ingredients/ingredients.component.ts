import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CompanyList, IngredientTypeTax, IngredientTypeVolume } from '../models/dictionaries';
import { IngredientsGroup, IngredientsPrices, InvoiceGroup } from '../models/db-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class IngredientsComponent implements OnInit, OnDestroy{
  // url: string = 'http://localhost:3000/invoiceList';
  url: string = 'http://localhost:3000/invoices/invoiceList';
  companyList = CompanyList;
  ingredientTypeVolume = IngredientTypeVolume;
  ingredientTypeTax = IngredientTypeTax;
  sub: Subscription

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
  ){}

  invoiceForm: FormGroup;
  invoiceList:FormArray;
  ingredientsList: FormArray;

  ngOnInit(){
    this.invoiceForm = this.fb.group({
      invoiceList: this.fb.array([])
    })
    this.sub = this.activeRoute.data.subscribe((res) => {
      if(res['resolver'].invoiceList.length){
        this.createInvoicesFromProxy(res['resolver'].invoiceList)
      }else{
        this.addInvoiceGroup();
      }
    })

    this.setBaseCalculation();
  }

  get getInvoiceList(){
    return this.invoiceForm.get('invoiceList') as FormArray
  }

  getIngredientsList(index: number){
    return this.getInvoiceList.get([index]).get('ingredientsList') as FormArray
  }

  createInvoicesFromProxy(invoiceList: InvoiceGroup[]){
    invoiceList.forEach(invoiceItem => {
      const invoiceGroup = this.createInvoiceGroup(invoiceItem);
      this.getInvoiceList.push(invoiceGroup)
      const invoiceLength = this.getInvoiceList.length - 1;
      invoiceItem.ingredientsList.forEach(ingredientItem => {
        const ingredientsGroup = this.createIngredientGroup(ingredientItem)
        this.getIngredientsList(invoiceLength).push(ingredientsGroup)
      })
    })
  }

  createInvoiceGroup(data?: InvoiceGroup){
    return this.fb.group({
      company: data?.company ?? '',
      date: data?.date ?? '',
      ingredientsList: this.fb.array([])
    })
  }

  createIngredientGroup(data?: IngredientsGroup){
    return this.fb.group({
      ingredientName: data?.ingredientName ?? '',
      ingredientQuantity: data?.ingredientQuantity ?? '',
      ingredientTypeVolume: data?.ingredientTypeVolume ?? '',
      prices: this.fb.group({
        ingredientPriceNet: data?.prices.ingredientPriceNet ?? '',
        ingredientTax: data?.prices.ingredientTax ?? '',
        ingredientPriceGross: data?.prices.ingredientPriceGross ?? '',
        worthNetto: data?.prices.worthNetto ?? '',
        worthGross: data?.prices.worthGross ?? '',
      })
    })
  }

  addInvoiceGroup(){
    const invoiceGroup = this.createInvoiceGroup()
    const ingredientsGroup = this.createIngredientGroup()
    this.getInvoiceList.push(invoiceGroup)
    this.getIngredientsList(this.getInvoiceList.length-1).push(ingredientsGroup)
  }

  addIngredientGroup(group){
    const ingredientsGroup = this.createIngredientGroup()
    this.getIngredientsList(group).push(ingredientsGroup)
  }

  setBaseCalculation(){
    const invoiceListLength = this.getInvoiceList.length
    for (let index = 0; index < invoiceListLength; index++) {
      const ingredientsArray: FormArray = (this.getIngredientsList(index) as FormArray)
      this.setCalcGross(ingredientsArray)
      this.setCalcWorth(ingredientsArray)
    }
  }

  setCalcGross(ingredientsArray: FormArray){
    ingredientsArray.controls.forEach(ingredient => {
      const prices = ingredient.get('prices')
      const ingredientPriceNet = prices.get('ingredientPriceNet');
      const ingredientPriceGross = prices.get('ingredientPriceGross');
      const ingredientTax = prices.get('ingredientTax')
      // calc gross price with netto and tax on netto change
      ingredientPriceNet.valueChanges.subscribe(value => {
        ingredientPriceGross.setValue(this.calcGross(value, ingredientTax.value))
      })
      ingredientTax.valueChanges.subscribe(value => {
        ingredientPriceGross.setValue(this.calcGross(ingredientPriceNet.value, value))
      })
    });
  }
  setCalcWorth(ingredientsArray: FormArray){
    ingredientsArray.controls.forEach(ingredient => {
      const prices = ingredient.get('prices')
      const ingredientPriceNet = prices.get('ingredientPriceNet');
      const ingredientPriceGross = prices.get('ingredientPriceGross');
      const ingredientQuantity = ingredient.get('ingredientQuantity')
      const calcQuantity = (quantity, price)=>{
        return quantity * price
      }
      // calc gross price with netto and tax on netto change
      ingredientQuantity.valueChanges.subscribe(value => {
        prices.get('worthNetto').setValue(calcQuantity(value, ingredientPriceNet.value))
        prices.get('worthGross').setValue(calcQuantity(value, ingredientPriceGross.value))
      })
      ingredientPriceNet.valueChanges.subscribe(value => {
        prices.get('worthNetto').setValue(calcQuantity(ingredientQuantity.value, value))
      })
      ingredientPriceGross.valueChanges.subscribe(value => {
        prices.get('worthGross').setValue(calcQuantity(ingredientQuantity.value, value))
      })
    });
  };

  calcGross(value: number, tax: number){
    return value + ((value * tax)/100)
  }

  submitApplication() {
    this.http.patch(this.url, this.invoiceForm.value  ).subscribe()
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
