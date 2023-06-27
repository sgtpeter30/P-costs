import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  url: string = 'http://localhost:3000/invoiceList';
  companyList = CompanyList;
  ingredientTypeVolume = IngredientTypeVolume;
  ingredientTypeTax = IngredientTypeTax;
  sub: Subscription

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
  ){}
  invoiceForm: FormGroup = this.fb.group({})
  // invoiceForm: FormGroup
  invoiceList:FormArray;
  ingredientsList: FormArray
  // ingredientsList = this.fb.array([
  //   this.createIngredientGroup()
  // ]);
  // invoiceGroup = this.fb.group({
  //   date: '',
  //   company: '',
  //   ingredientsList: this.ingredientsList
  // });

  // invoiceList:FormArray = this.fb.array([this.createInvoiceGroup()]);
  // invoiceList:FormArray = this.fb.array([]);

  // invoiceForm: FormGroup = this.fb.group({
    // invoiceList: this.createInvoiceList()
  // })

  log(invoiceGroup){
    console.log(invoiceGroup)
    console.log(invoiceGroup.value)
  }

  createInvoiceList(data?: InvoiceGroup[]){
    this.invoiceList = this.fb.array([])
    if(data){
      data.forEach(invoice=>{
        this.invoiceList.push(this.createInvoiceGroup(invoice))
      })
    }else{
      this.invoiceList.push(this.createInvoiceGroup())
    }
  }

  ngOnInit(){
    this.sub = this.activeRoute.data.subscribe((res) => {
      if(res['resolver'].length > 0){
        console.log(res['resolver']);
        // this.createInvoiceList(res['resolver'] as InvoiceGroup[])
        this.invoiceForm = this.fb.group({
          invoiceList: this.createInvoiceList()
        })
      }else{
        this.invoiceForm = this.fb.group({
          // invoiceList: this.invoiceList
          invoiceList: this.createInvoiceList()
        })
      }
    })
  }

  createInvoiceGroup(data?: InvoiceGroup){
    return this.fb.group({
      company: data?.company ?? '',
      date: data?.date ?? '',
      ingredientsList: this.createIngredientsList(data?.ingredientsList || null)
    })
  }


  createIngredientsList(data?: IngredientsGroup[]){
    let ingredientsList: FormArray = this.fb.array([]);
    console.log("ingredientsList create");
    console.log(ingredientsList);


    if(data){
      data.forEach(ingredient =>{
        console.log('push1');
        ingredientsList.push(this.createIngredientGroup(ingredient))
      })
    }else{
      ingredientsList.push(this.createIngredientGroup())
    }
    return ingredientsList
  }

  createIngredientGroup(data?: IngredientsGroup){
    return this.fb.group({
      ingredientName: data?.ingredientName ?? '',
      ingredientQuantity: data?.ingredientQuantity ?? '',
      ingredientTypeVolume: data?.ingredientTypeVolume ?? '',
      prices: this.createPrices(data?.prices ?? null),
      // prices: data?.prices ?? this.createPrices(),
    })
  }

  createPrices(data?: IngredientsPrices){
    this.fb.group({
      ingredientPriceNet: data?.ingredientPriceNet ?? [''],
      ingredientTax: data?.ingredientTax ?? [''],
      ingredientPriceGross: data?.ingredientPriceGross ?? [''],
    })
  }

  addInvoiceGroup(group){
    group.push(this.createInvoiceGroup())
  }
  addIngredientGroup(group){
    group.push(this.createIngredientGroup());
  }
  submitApplication() {
    // przerobić form
    // this.http.post(this.url, this.invoiceForm.value.invoiceList).subscribe()
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
