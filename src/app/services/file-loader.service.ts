import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

declare var require: any

const firstExFilemap: JSON = require('txt-files/cw1/file-tree.json');
const thirdExFilemap: JSON = require('txt-files/cw3/file-tree.json');
const fourthExFilemap: JSON = require('txt-files/cw4/file-tree.json');


@Injectable()
export class FileLoaderService {

  fileMap: {} = {
    1: firstExFilemap,
    3: thirdExFilemap,
    4: fourthExFilemap
  }
  constructor(private http:HttpClient) {
   }

   getFilesList(excerciseId) {
    return this.fileMap[excerciseId];
   }

   getContentOfFileForExOne(id,name){
     let fileTreeObject = this.getFilesList(id);
     let searchedElement;
     fileTreeObject.forEach(element => {
       if (element.name === name) {
        searchedElement = element;
       }
     });
     return forkJoin(
      this.http.get("txt-files/cw"+id+"/"+searchedElement.filename, { responseType: 'text' }),
      this.http.get("txt-files/cw"+id+"/"+searchedElement.typeFilename, { responseType: 'text' }),
     )
   }

   getContentOfFileForExThree(){
     let fileTreeObject = this.getFilesList(3);
     return forkJoin(
      this.http.get("txt-files/cw3/"+fileTreeObject.testSystem, { responseType: 'text' }),
      this.http.get("txt-files/cw3/"+fileTreeObject.treningSystem, { responseType: 'text' }),
     )
   }

   getContentOfFileForExFour(){
    let fileTreeObject = this.getFilesList(4);
    return forkJoin(
     this.http.get("txt-files/cw4/"+fileTreeObject.fileName, { responseType: 'text' }),
    )
  }
}
