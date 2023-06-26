import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { IngredientResolver } from './ingredient-resolver';
import { IngredientsComponent } from './ingredients/ingredients.component';

const routes: Routes = [
  {
    path: '',
    component: IngredientsComponent,
    resolve: {
      resolver: IngredientResolver
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
