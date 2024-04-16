import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {
  employee: Employee = new Employee();

  constructor(public employeeService: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.refreshEmployeeList();
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.employee = new Employee();
  }

  onSubmit(form: NgForm) {
    if (form.value._id === '') {
      this.employeeService.postEmployee(form.value).subscribe(
        (res) => {
          this.resetForm(form);
          this.refreshEmployeeList();
          M.toast({ html: 'Saved successfully', classes: 'rounded' });
        },
        (err) => {
          console.error(err);
          M.toast({ html: 'Error saving the employee', classes: 'rounded' });
        }
      );
    } else {
      this.employeeService.putEmployee(form.value).subscribe(
        (res) => {
          this.resetForm(form);
          this.refreshEmployeeList();
          M.toast({ html: 'Updated successfully', classes: 'rounded' });
        },
        (err) => {
          console.error(err);
          M.toast({ html: 'Error updating the employee', classes: 'rounded' });
        }
      );
    }
  }

  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe(
      (res: Employee[]) => {
        this.employeeService.employees = [...res];
      },
      (err) => {
        console.error(err);
        M.toast({ html: 'Error loading employees', classes: 'rounded' });
      }
    );
  }

  onEdit(emp: Employee) {
    const clonedEmp = { ...emp };
    this.employeeService.selectedEmployee = clonedEmp;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.employeeService.deleteEmployee(_id).subscribe(
        (res) => {
          this.refreshEmployeeList();
          this.resetForm(form);
          M.toast({ html: 'Deleted successfully', classes: 'rounded' });
        },
        (err) => {
          console.error(err);
          M.toast({ html: 'Error deleting the employee', classes: 'rounded' });
        }
      );
    }
  }
}