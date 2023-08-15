import { ConfirmationService, MessageService } from 'primeng/api';

import { Component, OnInit } from '@angular/core';

import { Papa } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';

import { Employee } from 'src/app/models/employees/Employee.models';
import { Department } from 'src/app/models/employees/departments';
import { EmployeesService } from 'src/app/services/employees/employees.services';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  employees: Employee[] = [];
  employeesLoading: boolean = false;
  loadingFormDialog: boolean = false;

  departments: Department[] = [];

  deleteLoading: boolean = false;

  selectedEmployee?: Employee = undefined;

  showFormDialog: boolean = false;

  exportSidebarVisible: boolean = false;
  importSidebarVisible: boolean = false;
  
  constructor(
    private employeeService: EmployeesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.departments = [
      { name: 'CS' },
      { name: 'IS' },
      { name: 'IT' },
      { name: 'DS' }
    ]
  }
  ngOnInit(): void {
    this.loadEmployeesFromDb();
  }

  loadEmployeesFromDb() {
    this.employeesLoading = true;
    this.employeeService.getAllEmployees().subscribe(
      {
        next: (employees) => {
          this.employees = employees;
          console.log(this.employees);
          this.employeesLoading = false;
        },
        error: (opthions) => {
        }
      }
    );
  }
  confirmDelete(employee: Employee, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to Delete ${employee.name} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.onDelete(employee);

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
  onDelete(employee: Employee) {
    this.deleteLoading = true;
    this.employeeService.deleteEmployeeById(employee.id).subscribe({
      next: (response) => {
        this.employees = this.removeEmployeeFromListById(employee.id);
        this.deleteLoading = false;
      },
      error: (error) => {
        this.deleteLoading = false;
      }
    })
  }
  removeEmployeeFromListById(id: string) {
    return this.employees.filter((employee) => employee.id !== id);
  }

  onClickUpdateBtn(employee: Employee) {
    this.showFormDialog = true;
    this.selectedEmployee = employee;
  }
  onClickAddBtn() {
    this.selectedEmployee = undefined;
    this.showFormDialog = true;
  }
  onCancelDialog() {
    this.showFormDialog = false;
  }

  onEmployeeChanged(employee: Employee) {
    const index = this.employees.findIndex(emp => emp.id == employee.id);
    if (index == -1)
      this.employees.push(employee);
    else
      this.employees[index] = employee;
    this.showFormDialog = false;
  }

  getCsvBlob() {
    const exportedItems: any = this.getExportedData();
    const csvString = new Papa().unparse(exportedItems);
    let EXCEL_EXTENSION = '.csv';
    const data = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    FileSaver.saveAs(data, 'Employees' + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  getExportedData() {
    return this.employees.map(e => {
      return {
        'Name': e.name,
        'Email': e.email,
        'Phone': e.phone,
        'Salary': e.salary,
        'Department': e.department
      }
    });
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.employees);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'employees_list');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }




}
