import { Component, OnInit, ViewChild } from '@angular/core';
import { Contact, ContactService } from '../contact.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phone', 'email', 'actions'];
  dataSource: MatTableDataSource<Contact>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private contactService: ContactService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.contactService.getContacts());
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editContact(contact: Contact) {
    this.router.navigate(['/edit-contact', contact.id]);
  }

  deleteContact(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this contact?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(id);
        this.refreshContacts();
        Swal.fire(
          'Deleted!',
          'Contact has been deleted.',
          'success'
        );
      }
    });
  }

  refreshContacts() {
    this.dataSource.data = this.contactService.getContacts();
  }
}
