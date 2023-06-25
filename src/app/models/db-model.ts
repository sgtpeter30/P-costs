import { FormGroup } from "@angular/forms"

export interface InvoiceGroup {
  date: Date,
  company: string,
  ingredientsList: IngredientsGroup[];
}
export interface IngredientsGroup {
    ingredientName: string,
    ingredientQuantity: number,
    ingredientTypeVolume: string,
    pricePerYear: PricesPerYear
}
export interface PricesPerYear{
  ingredientYear: string,
  ingredientPriceNet: number,
  ingredientTax: number,
  ingredientPriceGross: number,
}
