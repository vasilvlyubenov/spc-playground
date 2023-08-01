import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BatchService } from '../batch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISpc } from 'src/app/interfaces/Spc';

interface IPartSpc {
  dimensionId: string;
  results: IResults[];
  measurementDate: Date;
}

interface IResults {
  firstMeasurement: string;
  secondMeasurement: string;
  thirdMeasurement: string;
  fourthMeasurement: string;
  fifthMeasurement: string;
}

@Component({
  selector: 'app-spc-charts',
  templateUrl: './spc-charts.component.html',
  styleUrls: ['./spc-charts.component.css'],
})
export class SpcChartsComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  getBatchSub!: Subscription;
  batchId: string = '';
  partId: string = '';
  graphArray: Array<any>;

  // Chart formula logic needs to be changed current one is for the sake of the project to work!
  constructor(
    private batchService: BatchService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.graphArray = [];
  }

  private getStandardDeviation(array: Array<number>) {
    if (!array || array.length === 0) {
      return 0;
    }
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => (x - mean) ** 2).reduce((a, b) => a + b) / n
    );
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.batchId = this.route.snapshot.params['batchId'];
    this.partId = this.route.snapshot.params['partId'];
    this.getBatchSub = this.batchService
      .getBatchForSpc(this.batchId)
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.router.navigate([`${this.partId}/batch-list`]);
            this.isLoading = false;
            alert(error.message);
            throw error;
          }

          const partDimensionsData = JSON.parse(data[0].parts.spc_dimensions);
          const parsedMeasurementsData = JSON.parse(
            data[0].spc_dimension_results
          );

            if (parsedMeasurementsData === null) {
              this.isLoading = false;
              throw Error('Missing data');
            }
            
          parsedMeasurementsData.sort(function (a: IPartSpc, b: IPartSpc) {
            return (
              new Date(a.measurementDate).getTime() -
              new Date(b.measurementDate).getTime()
            );
          });

          parsedMeasurementsData.forEach((element: IPartSpc) => {
            const resArr: Array<any> = [];

            element.results.forEach((dim) => {
              resArr.push(Object.values(dim).map(Number));
            });

            //Array for the final data
            const dataArray: Array<number> = [];

            resArr.forEach((arr) => {
              const sum = arr.reduce((acc: number, curr: number) => {
                return acc + curr;
              }, 0);

              dataArray.push(Math.floor((sum / 5) * 100) / 100);
            });

            // console.log(dataArray);

            //standard deviation
            const standardDeviation = this.getStandardDeviation(dataArray);
            const avg =
              Math.floor(
                (dataArray.reduce((acc, curr) => acc + curr, 0) /
                  dataArray.length) *
                  100
              ) / 100;
            const upperControlLimit = avg + (3 * standardDeviation);
            const lowerControlLimit = avg - (3 * standardDeviation);

            const partDimension = partDimensionsData.filter(
              (x: ISpc) => x.id === element.dimensionId
            );

            const nominalValue = Number(partDimension[0].dimension);
            const upperLimit = Number(partDimension[0].upperLimit);
            const lowerLimit = Number(partDimension[0].lowerLimit);

            const errorIndex = [];
            const errorDim = [];
              // console.log(upperControlLimit);
              
            for (let i = 0; i < dataArray.length; i++) {
              if (
                (dataArray[i] >= nominalValue + upperLimit) || 
                (dataArray[i] <= nominalValue - lowerLimit)
              ) {
                errorIndex.push(i + 1);
                errorDim.push(dataArray[i]);
              }
            }
            
            // console.log(nominalValue);
            // console.log(lowerLimit);
            // console.log(upperLimit);
            
            const data = {
              type: 'scatter',
              x: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25,
              ],
              y: dataArray,
              mode: 'lines+markers',
              name: 'Dim.',
              showlegend: true,
              hoverinfo: 'all',
              line: {
                color: 'blue',
                width: 2,
              },
              marker: {
                color: 'blue',
                size: 8,
                symbol: 'circle',
              },
            };

            const viol = {
              type: 'scatter',
              x: errorIndex,
              y: errorDim,
              mode: 'markers',
              name: 'Violation',
              showlegend: true,
              marker: {
                color: 'rgb(255,65,54)',
                line: { width: 3 },
                opacity: 0.5,
                size: 12,
                symbol: 'circle-open',
              },
            };

            const cl = {
              type: 'scatter',
              x: [0, 25, null, 0, 25],
              y: [nominalValue - lowerLimit, nominalValue - lowerLimit, null, nominalValue + upperLimit, nominalValue + upperLimit],
              mode: 'lines',
              name: 'LCL/UCL',
              showlegend: true,
              line: {
                color: 'red',
                width: 2,
                dash: 'dash',
              },
            };

            const centre = {
              type: 'scatter',
              x: [0, 25],
              y: [nominalValue, nominalValue],
              mode: 'lines',
              name: 'Centre',
              showlegend: true,
              line: {
                color: 'grey',
                width: 2,
              },
            };

            const histo = {
              type: 'histogram',
              x: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                22, 23, 24, 25,
              ],
              y: dataArray,
              name: 'Distribution',
              orientation: 'h',
              marker: {
                color: 'blue',
                line: {
                  color: 'white',
                  width: 1,
                },
              },
              xaxis: 'x2',
              yaxis: 'y2',
            };

            const graph = {
              data: [data, viol, cl, centre, histo],
              layout: {
                title: 'Basic SPC Chart',
                xaxis: {
                  domain: [0, 0.7], // 0 to 70% of width
                  zeroline: false,
                },
                yaxis: {
                  range: [nominalValue - lowerLimit - 0.15, nominalValue + upperLimit + 0.15],
                  zeroline: false,
                },
                xaxis2: {
                  domain: [0.8, 1], // 70 to 100% of width
                },
                yaxis2: {
                  anchor: 'x2',
                  showticklabels: false,
                },
              },
            };

            this.graphArray.push(graph);

            this.isLoading = false;
          });
        },
        error: (err) => {
          console.log('Error fetching data:', err);
          this.isLoading = false;
          throw err;
        },
      });
  }

  ngOnDestroy(): void {
    this.getBatchSub.unsubscribe();
  }
}
