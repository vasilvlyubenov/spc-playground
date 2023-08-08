import { Component, OnInit, OnDestroy } from '@angular/core';
import { PartsService } from '../parts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { ISpc } from 'src/app/interfaces/Spc';

@Component({
  selector: 'app-part-details',
  templateUrl: './part-details.component.html',
  styleUrls: ['./part-details.component.css']
})
export class PartDetailsComponent implements OnInit, OnDestroy {
partId!: string;
partInfoSub!: Subscription;
downloadSub!: Subscription;
partInfo: any;
spcDimensions!: Array<ISpc> | null;

constructor(private partsService: PartsService, private route: ActivatedRoute) {}

downloadDrawing() {{
  this.downloadSub = this.partsService.getDrawingFile(this.partInfo?.drawings?.file_url).subscribe(res => {
    debugger
    const fileType = res.data.type;
    const file = new Blob([res.data], { type: fileType})
    saveAs(file)
  })
}}

  ngOnInit(): void {
    this.partId = this.route.snapshot.params['partId'];

    this.partInfoSub = this.partsService.getPartById(this.partId).subscribe({
      next: ({data, error}) => {
        if (error) {
          throw error;
        }

        this.partInfo = data[0];
        this.spcDimensions = JSON.parse(data[0].spc_dimensions);
        console.log(this.spcDimensions);
        
      }
    });
  }

  ngOnDestroy(): void {
      this.partInfoSub.unsubscribe();
      this.downloadSub?.unsubscribe();
  }
}
