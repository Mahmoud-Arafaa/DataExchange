import { Component, OnInit, Input , Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { addEmployeeDto } from 'src/app/dtos/employees/addEmployeeDto.dto';
import { Employee } from 'src/app/models/employees/Employee.models';
import { Department } from 'src/app/models/employees/departments';
import { EmployeesService } from 'src/app/services/employees/employees.services';

@Component({
  selector: 'app-add-update-employee',
  templateUrl: './add-update-employee.component.html',
  styleUrls: ['./add-update-employee.component.css']
})
export class AddUpdateEmployeeComponent implements OnInit , OnChanges {

  employeeForm!: FormGroup;
  departmentsDropList:Department[]=[];

  @Input() selectedEmployee?: Employee = undefined;
  @Output() onEmployeeChanged = new EventEmitter<Employee>();

  @Output() onCancelDialog : EventEmitter<boolean> = new EventEmitter<boolean>;

  loadingFormDialog: boolean = false;

  constructor(private fb: FormBuilder,
              private employeeService : EmployeesService,
  )
  {
    this.departmentsDropList = [
      {name:'IT'},
      {name:'CS'},
      {name:'IS'},
      {name:'IT'}
    ]
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedEmployee"]) {
      if(this.selectedEmployee){
        this.employeeForm.patchValue({...this.selectedEmployee});
      }else{
        this.employeeForm.reset();
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      email: ['', [Validators.required, Validators.email]],   //, [this.uniqueEmailValidator.bind(this)]
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      salary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      department: ['', [Validators.required]]
    },
      {
        // validators: this.MatchValidator('password', 'confirmpassword')
      });
  }
  get name() { return this.employeeForm.controls['name']; }
  get email() { return this.employeeForm.controls['email']; }
  get password() { return this.employeeForm.controls['password']; }
  get confirmpassword() { return this.employeeForm.controls['confirmpassword']; }
  get phone() { return this.employeeForm.controls['phone']; }
  get salary() { return this.employeeForm.controls['salary']; }
  get department() { return this.employeeForm.controls['department']; }

  onClickCancelDialogBtn(){
    this.onCancelDialog.emit();
  }

  updateEmployee(){
    if(!this.selectedEmployee || this.employeeForm.invalid)
      return;
      this.loadingFormDialog=true;
      this.selectedEmployee = { ...this.selectedEmployee, ...this.employeeForm.value };
      this.employeeService.updateEmployee(this.selectedEmployee!.id,this.selectedEmployee!).pipe(take(1)).subscribe({
        next:(employee)=>{
            this.employeeForm.reset();
            this.onEmployeeChanged.emit(employee);
            this.loadingFormDialog=false;
        }
      })
  }
  addEmployee(){
    if(this.selectedEmployee || this.employeeForm.invalid)
       return;
    this.loadingFormDialog = true;
    const addedEmployee : addEmployeeDto = this.employeeForm.value;
    this.employeeService.addEmployee(addedEmployee).subscribe({
      next:(employee)=>{
        this.employeeForm.reset();
        this.loadingFormDialog = false;
        this.onEmployeeChanged.emit(employee);
      }
    })
  }




}
