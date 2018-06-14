import { Component, OnInit } from '@angular/core';
import { FileLoaderService } from '../services/file-loader.service';
import { ViewModeEnum } from './viewModeEnum';

@Component({
  selector: 'app-first-excercise',
  templateUrl: './first-excercise.component.html',
  styleUrls: ['./first-excercise.component.css']
})



export class FirstExcerciseComponent implements OnInit {

  excerciseId: number = 1;
  files = this.fileService.getFilesList(this.excerciseId);
  currentFile: any;
  currentFileTypes: any;
  selectedFile;
  selectedAttrib;
  deviationForSelectedAttrib;
  viewMode = ViewModeEnum.VALUES;
  viewModes = ViewModeEnum;
  decisionClasses: Array<{klasa: string,count: number}> = new Array<{klasa: string,count: number}>();
  numericAttributes: Array<{atrybut: string, index: number, min:number,max:number, valuesCount?: number, valuesList?: number[]}> = new  Array<{atrybut: string, index: number, min:number,max:number}>();
  constructor(private fileService: FileLoaderService) { }

  ngOnInit() {
  }

  select(file) {
    this.selectedFile = file;
    this.fileService.getContentOfFileForExOne(this.excerciseId, file.name).subscribe((result) => {
      this.decisionClasses = new Array<{klasa: string,count: number}>();
      this.selectedAttrib = null
      this.currentFile = this.convertFileToArray(result[0]);
      this.currentFileTypes = this.convertFileToArray(result[1]);
      this.getDecisionClasses();
      this.getNumericAttributes();
    });
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
    this.decisionClasses = new Array<{klasa: string,count: number}>();
    let index = 0;
    this.currentFile.forEach(row => {
      if (this.decisionClasses.findIndex(x => x.klasa === row[row.length - 1]) === -1) {
        this.decisionClasses.push({klasa: row[row.length - 1], count: 1});
      } else {
        this.decisionClasses.find(x => x.klasa === row[row.length - 1]).count++;
      }
    });
  }

  getNumericAttributes() {
    this.numericAttributes = new  Array<{atrybut: string, index: number, min:number,max:number}>();
    let index = 0;
    this.currentFileTypes.forEach(row => {
      if(row[row.length-1] === "n"){
        if(this.numericAttributes.findIndex(x => x.atrybut === row[0]) === -1){
          this.numericAttributes.push({atrybut: row[0], index: index, max:Number(this.currentFile[0][index]),min:Number(this.currentFile[0][index]), valuesCount: 1, valuesList: [Number(this.currentFile[0][index])]})
        }
      }
      index++;
    })
    this.currentFile.forEach(row => {
      this.numericAttributes.forEach(attr => {
        Number(row[attr.index])>attr.max? attr.max = Number(row[attr.index]) : false;
        Number(row[attr.index])<attr.min? attr.min = Number(row[attr.index]) : false;
        if(attr.valuesList.findIndex(x=>x === Number(row[attr.index])) === -1){
          attr.valuesCount++;
          attr.valuesList.push(Number(row[attr.index]));
        }
        
      })
    })
  }

  showValues(attrib){
    this.viewMode = ViewModeEnum.VALUES;
    this.selectAttrib(attrib);
  }

  showStandardDeviation(attrib){
    this.viewMode = ViewModeEnum.STANDARD_DEVIATION;
    this.deviationForSelectedAttrib = this.getStandardDeviation(attrib)
    this.selectAttrib(attrib);
  }

  selectAttrib(attrib){
    this.selectedAttrib = attrib;
  }

  getStandardDeviation(attribute: {atrybut: string, index: number, min:number,max:number, valuesCount?: number, valuesList?: number[]}, decisionClass?: string){
    let filteredItems
    if(decisionClass){
      filteredItems = this.currentFile.filter(x=>x[x.length-1] === decisionClass);

    } else {
      filteredItems = this.currentFile;
    }
    let sum: number = 0;
    let index: number = 0;
    let srednia: number = 0;
    filteredItems.forEach(element => {
      sum += Number(element[attribute.index]);
      index++;
    })
    srednia = sum/index;
    sum=0;
    filteredItems.forEach(element => {
      sum += (Number(element[attribute.index]) - srednia)*(Number(element[attribute.index]) - srednia);
    })
    let standartDeviation = sum/index;
    return Math.sqrt(standartDeviation)
  }
}

