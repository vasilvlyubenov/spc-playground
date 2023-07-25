import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-part',
  templateUrl: './create-part.component.html',
  styleUrls: ['./create-part.component.css']
})
export class CreatePartComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  errorMessage: string = '';

  createPartHandler(form: NgForm) {

  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }
}
