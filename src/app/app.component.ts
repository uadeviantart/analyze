import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Papa from 'papaparse';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor() {
    Chart.register(...registerables);
    this.loadCSVData();
  }
  chartData:any;
  labels:any;
  values:any;

  loadCSVData() {
    fetch('assets/data.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          delimiter: ',',
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            let rawData = result.data;

            const aggregatedData:any = rawData.reduce((d:any, current:any) => {
              const existingItem = d.find((item:any) => item.Category === current.Category);

              if (existingItem) {
                existingItem.Amount += current.Amount;
              } else {
                d.push({ Category: current.Category, Amount: current.Amount });
              }

              return d;
            }, []);


            this.labels = aggregatedData.map((item:any) => item['Category']);
            this.values = aggregatedData.map((item:any) => item['Amount']);


            this.createChart();
          }
        });
      })

  }


  createChart(){
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    if(ctx){
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: '# of Votes',
            data: this.values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    }
  }
}
