import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// form control
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';

// navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// layout
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { MatTreeModule } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // button & indicator
import { MatProgressBarModule } from '@angular/material/progress-bar'; // button & indicator

// table
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

// import {
// MatRadioModule,
// MatSelectModule,
// MatInputModule,
// MatButtonModule,
// MatIconModule,
// MatDatepickerModule,
// MatNativeDateModule,
// MatDialogModule,
// MatTooltipModule,
// MatCheckboxModule,
// MatAutocompleteModule,
// MatButtonToggleModule,
// MatChipsModule, MatBottomSheetModule, MatSliderModule, MatStepperModule, MatGridListModule
// } from '@angular/material'; // form control
// import { MatMenuModule, MatSidenavModule, MatToolbarModule } from '@angular/material'; // navigation
// import { MatListModule, MatCardModule, MatTabsModule } from '@angular/material'; // layout
// import { MatTreeModule } from '@angular/material';
// import { MatProgressSpinnerModule } from '@angular/material'; // button & indicator
// import { MatProgressBarModule } from '@angular/material'; // button & indicator
// import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material'; // table
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// 流式布局
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    // MatRangeDateSelectionModel,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatExpansionModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    MatBottomSheetModule,
    MatSliderModule,
    MatStepperModule,
    MatGridListModule,
    MatSlideToggleModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    // MatRangeDateSelectionModel,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatTreeModule,
    MatExpansionModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    MatSliderModule,
    MatBottomSheetModule,
    MatStepperModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatButtonToggleModule
  ]
})

export class MatSharedModule {
}
