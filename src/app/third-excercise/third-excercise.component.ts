import { Component, OnInit } from '@angular/core';
import { FileLoaderService } from '../services/file-loader.service';
import { MetricTypes } from './metricsEnum';

@Component({
  selector: 'app-third-excercise',
  templateUrl: './third-excercise.component.html',
  styleUrls: ['./third-excercise.component.css']
})
export class ThirdExcerciseComponent implements OnInit {

  info: { testedRow: any; testedClass: any; minClass: any; };
  constructor(private fileService: FileLoaderService) { }

  testSystem;
  treningSystem;
  decisionClasses;
  metricTypes = MetricTypes;
  kAttribute: number = 2;
  selectedMetricType: MetricTypes = MetricTypes.EUCLIDES;
  report;
  globalAcc;
  globalCov;

  ngOnInit() {
    this.fileService.getContentOfFileForExThree().subscribe(result => {
      this.testSystem = this.convertFileToArray(result[0]);
      this.treningSystem = this.convertFileToArray(result[1]);
      this.getDecisionClasses();
      this.updateReport();
    })
  }

  convertFileToArray(file: string) {
    let fileRows = file.trim().split('\n');
    let tmpFile: any = [];
    fileRows.forEach(row => {
      let tmpRow = row.trim().split(' ').filter(function (el) { return el.length != 0 });
      tmpFile.push(tmpRow);
    });
    return tmpFile;
  }

  getDecisionClasses() {
    this.decisionClasses = new Array<{ klasa: string, count: number }>();
    let index = 0;
    this.testSystem.forEach(row => {
      if (this.decisionClasses.findIndex(x => x.klasa === row[row.length - 1]) === -1) {
        this.decisionClasses.push({ klasa: row[row.length - 1], count: 1 });
      } else {
        this.decisionClasses.find(x => x.klasa === row[row.length - 1]).count++;
      }
    });
    this.treningSystem.forEach(row => {
      if (this.decisionClasses.findIndex(x => x.klasa === row[row.length - 1]) === -1) {
        this.decisionClasses.push({ klasa: row[row.length - 1], count: 1 });
      } else {
        this.decisionClasses.find(x => x.klasa === row[row.length - 1]).count++;
      }
    });
  }


  selectMetricType(type) {
    this.selectedMetricType = type;
    this.updateReport();
  }

  getLabelFor(testRow) {
      this.info = this.getInfo(testRow);
      return this.generateInfoText();
  }


  updateReport(){
    this.report = [];
    this.testSystem.forEach(row => {
      let information = this.getInfo(row);
      if(information.minClass !="error"){
        this.report.push(this.getInfo(row));
      } 
    })
      this.decisionClasses.forEach(decClass => {
        let classMembers = this.report.filter(x=>x.minClass === decClass.klasa)
          decClass.accuracy = classMembers.filter(x=>x.isGoodClasified).length / classMembers.length;
          decClass.coverage = classMembers.length / this.testSystem.filter(x => x[x.length-1] === decClass.klasa).length;
          decClass.noOfObj = this.testSystem.filter(x => x[x.length-1] === decClass.klasa).length;
          decClass.TPR = classMembers.filter(x => x.isGoodClasified).length / (classMembers.length)
      });
      this.globalAcc = this.report.filter(x => x.isGoodClasified).length / this.report.length;
      this.globalCov = this.report.length / this.testSystem.length;
  }

  getInfo(testRow) {
    let trainingArray = this.treningSystem
    let listsByDecision: any[] = [];
    this.decisionClasses.forEach(decClass => {
      listsByDecision.push({ array: trainingArray.filter(x => x[x.length - 1] === decClass.klasa), class: decClass.klasa, distances: [] });
    })
    listsByDecision.forEach(trainingRow => {
      let d = 0;
      let distances: any[] = [];
      trainingRow.array.forEach(element => {
        for (let i = 0; i < testRow.length - 1; i++) {
          switch (this.selectedMetricType) {
            case MetricTypes.EUCLIDES: {
              d += (Number(testRow[i]) - Number(element[i])) * (Number(testRow[i]) - Number(element[i]))
              break;
            }
            case MetricTypes.MANHATTAN: {
              d += Math.abs(Number(testRow[i] - Number(element[i])));
              break;
            }
            case MetricTypes.CANBERRA: {
              d += Math.abs((Number(testRow[i]) - Number(element[i])) / (Number(testRow[i]) + Number(element[i])));
              break;
            }
            case MetricTypes.CZEBYSZEW: {
              console.log(MetricTypes.CZEBYSZEW)
              break;
            }
            case this.metricTypes.PEARSON: {
              console.log(MetricTypes.PEARSON)
              break;
            }
          }
        }
        this.metricTypes.EUCLIDES? d = Math.sqrt(d) : false;
        trainingRow.distances.push(d);
        distances = [];
        d = 0;
      })

    })
    let classMinNeighbours = [];
    this.decisionClasses.forEach(decClass => {
      let list = listsByDecision.find(x => x.class === decClass.klasa);
      let min = 0;
      let minSum = 0;
      for (let i=0;i<this.kAttribute;i++){
        min = Math.min.apply(null,list.distances);
        minSum+=min;
        list.distances.splice(list.distances.findIndex(x=> x === min),1);
      }
      classMinNeighbours.push({class:decClass,minSum:minSum})
    });

    let currentMinValue = classMinNeighbours[0].minSum;
    let currentMinObject = classMinNeighbours[0];
    classMinNeighbours.forEach(element => {
      if(element.minSum === currentMinValue && element.class != currentMinObject.class){
        currentMinObject = 'niechwytaj'
        return
      } else if (element.minSum<currentMinValue){
        currentMinObject = element.minSum;
        currentMinObject = element;
      } 
    })
    return {
      testedRow: testRow,
      testedClass: testRow[testRow.length-1],
      minClass: currentMinObject.class != undefined? currentMinObject.class.klasa : 'error',
      isGoodClasified: currentMinObject.class != undefined && testRow[testRow.length-1] === currentMinObject.class.klasa? true : false,
    }
  }

  generateInfoText(){
    let text = "Obiekt ["
    for(let i=0;i<this.info.testedRow.length-1;i++){
      text += " "+this.info.testedRow[i]+" "
    }
    text += " ]"
    if(this.info.minClass==='error'){
      text+=" nie jest chwytany " 
    } else if (this.info.minClass != this.info.testedClass) {
      text += " otrzymuje decyzje "+this.info.minClass+" jest błędnie sklasyfikowany"
    } else if (this.info.minClass === this.info.testedClass) {
      text += " otrzymuje decyzje " + this.info.minClass+" jest poprawnie sklasyfikowany"
    }
  return text;
  }
}
