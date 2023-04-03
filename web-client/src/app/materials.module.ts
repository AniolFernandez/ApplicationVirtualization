import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  exports: [
    MatIconModule,
    MatInputModule,
  ]
})
export class MaterialsModule {}