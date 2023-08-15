import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';

import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { AddUpdateEmployeeComponent } from './components/add-update-employee/add-update-employee.component';
import { ImportEmployeesComponent } from './components/import-employees/import-employees.component';

const routes: Routes = [

  {
    path: '',
    redirectTo:'employees',
    pathMatch:'full'
  },
  {
    path:'employees',
    component:EmployeesListComponent
  },
  {
    path: 'form',
    component: AddUpdateEmployeeComponent
  }
]

@NgModule({
  declarations: [
    EmployeesListComponent,
    AddUpdateEmployeeComponent,
    ImportEmployeesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    FileUploadModule,
    ToolbarModule,
    TagModule,
    ToastModule,
    InputTextModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    DialogModule,
    SidebarModule

  ]
})
export class EmployeeModule { }
