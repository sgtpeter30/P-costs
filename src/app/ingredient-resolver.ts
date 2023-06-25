import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

@Injectable({providedIn: 'root',})
export class IngredientService {
  url: string = 'http://localhost:3000/invoiceList';

  constructor(
    private http: HttpClient
  ){}

  getIngredients() {
    console.log(this.http.get(this.url));

    return this.http.get(this.url);
  }
}

export const  IngredientResolver: ResolveFn<any> =
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(IngredientService).getIngredients();
};
