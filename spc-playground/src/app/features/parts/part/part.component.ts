import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PartsService } from '../parts.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})

export class PartComponent implements OnInit, OnDestroy {
  isLoading: boolean = false
  panelOpenState = false;
  partsSubscripton!: Subscription
  parts!: Array<any>;
  error: string = '';
  
  constructor(private partService: PartsService) {}
  
  showParts() {
    console.log(this.parts);
    
  }

  ngOnInit(): void {
    this.isLoading = true;
      this.partsSubscripton =this.partService.getAllParts().subscribe({
        next: ({data, error}) => {
          if (error) {
            this.error = error.message;
            throw error;
          }

          this.parts = data;
          this.isLoading = false;
        }
      });
      
  }

  ngOnDestroy(): void {
      this.partsSubscripton.unsubscribe();
  }
}
