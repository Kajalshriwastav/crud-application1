import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactService } from '../contact.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  contactId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.contactId = +contactId;
      const contact = this.contactService.getContactById(this.contactId);
      if (contact) {
        this.contactForm.patchValue(contact);
      }
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactData = { ...this.contactForm.value };
      if (this.contactId !== null) {
        contactData.id = this.contactId;
        this.contactService.updateContact(contactData);
        Swal.fire({
          title: 'Success',
          text: 'Contact updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        this.contactService.saveContact(contactData);
        Swal.fire({
          title: 'Success',
          text: 'Contact added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      this.router.navigate(['/contacts']);
    }
  }
}
