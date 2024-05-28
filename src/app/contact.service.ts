import { Injectable } from '@angular/core';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private nextId = 1;

  constructor() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
      this.nextId = this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
    }
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getContactById(id: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  saveContact(contact: Contact): void {
    contact.id = this.nextId++;
    this.contacts.push(contact);
    this.updateLocalStorage();
  }

  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === updatedContact.id);
    if (index > -1) {
      this.contacts[index] = updatedContact;
      this.updateLocalStorage();
    }
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.updateLocalStorage();
  }

  private updateLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
}
