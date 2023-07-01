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
    prices: IngredientsPrices
}
export interface IngredientsPrices{
  ingredientPriceNet: number,
  ingredientTax: number,
  ingredientPriceGross: number,
  worthNetto: number;
  worthGross: number;
}
