import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-auth',
  imports: [ CommonModule, FormsModule, RouterLink],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css'
})
export class UserAuth  implements OnInit {

  constructor(private newuser: UserService, private router:Router) { }
  ngOnInit(): void { }

  user = {
    name: '',
    email: '',
    phno: '',
    password: '',
    confirmPassword: ''
  };

  duplicateUser: string | null = null;

}
