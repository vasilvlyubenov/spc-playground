import { Component, OnInit, OnDestroy } from '@angular/core';
import { PartsService } from '../parts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-part-details',
  templateUrl: './part-details.component.html',
  styleUrls: ['./part-details.component.css']
})
export class PartDetailsComponent implements OnInit, OnDestroy {
partId!: string;
partInfoSub!: Subscription;

constructor(private partsService: PartsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['partId'];

    this.partInfoSub = this.partsService.getPartById(this.partId).subscribe({
      next: ({data, error}) => {
        if (error) {
          throw error;
        }

        console.log(data);
        
      }
    });
  }

  ngOnDestroy(): void {
      
  }
}
