import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employees/Employee.models';
import { addEmployeeDto } from 'src/app/dtos/employees/addEmployeeDto.dto';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  
  url : string = 'https://localhost:7190/api/employees/';
  constructor(private http : HttpClient) { }

  getAllEmployees():Observable<Employee[]>{
    return this.http.get<Employee[]>('https://localhost:7190/api/employees');
  }

  addEmployee(addEmployeeRequest : addEmployeeDto ):Observable<Employee>{
    return this.http.post<Employee>(this.url,addEmployeeRequest);
  }

  getEmployeeById(id:string):Observable<Employee>{
    return this.http.get<Employee>(this.url.concat(id));
  }

  updateEmployee(id:string,updateEmployeeRequest:Employee):Observable<Employee>{
    return this.http.put<Employee>(this.url.concat(id),updateEmployeeRequest);
  }
  deleteEmployeeById(id:string):Observable<Employee>{
    return this.http.delete<Employee>(this.url.concat(id));
  }
  findEmployeeByEmail(email:string):Observable<Employee>{
    return this.http.get<Employee>(this.url.concat(email));
  }
}
 