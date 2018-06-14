import { Component, OnInit } from '@angular/core';
import { FileLoaderService } from '../services/file-loader.service';
import { IParagon, IProduct, IProductWithCount } from './ParagonModel';

@Component({
  selector: 'app-fourth-excercise',
  templateUrl: './fourth-excercise.component.html',
  styleUrls: ['./fourth-excercise.component.css']
})
export class FourthExcerciseComponent implements OnInit {

  constructor(private fileService: FileLoaderService) { }

  D: IParagon[];
  frequencyThreshold: number = 2;
  F1: IProduct[] = [];
  F1withCounts: IProductWithCount[] =[];
  C2;
  F2: Array<IProduct[]>;
  C3;


  ngOnInit() {
    this.fileService.getContentOfFileForExFour().subscribe(result => {
      let tmpParagons = this.convertFileToArray(result[0]);
      this.D = this.mapToParagon(tmpParagons);
      this.F1 = this.getFrequentEvents(this.D,false);
      this.F1withCounts = this.getFrequentEvents(this.D,true);
      this.getCandidates(this.D,this.F1, this.F1withCounts);
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

  mapToParagon(list:any[]): IParagon[]{
    let paragons: IParagon[] = [];
    list.forEach(row => {
      let paragon: IParagon = { products: [] };      
      row.forEach(element => {
        paragon.products.push({ name: element });
      });
      paragons.push(paragon);
    })
    return paragons;
  }

  getFrequentEvents(list: IParagon[],withCounts:boolean): IProductWithCount[]{
    let tmpFrequentEvents: IProductWithCount[] = [];
    list.forEach(element => {
      element.products.forEach(el => {
        let index = tmpFrequentEvents.findIndex(x => x.name === el.name)
        if (index === -1){
          tmpFrequentEvents.push({ name: el.name, count:1});
        } else tmpFrequentEvents[index].count++
      })
    })
    tmpFrequentEvents = tmpFrequentEvents.filter(x=> x.count > this.frequencyThreshold-1).sort(((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    }))
    if(!withCounts){
      tmpFrequentEvents.forEach(element => {
        delete element.count;
      });
    }
    return tmpFrequentEvents;
  }

  getCandidates(D,F1,counts){
    let C2 = [];
    let C3 = [];
    let F2: Array<IProduct[]> = [];
    for(let i=0;i<F1.length-1;i++){
      for(let j=i+1; j<F1.length;j++){
        if(F1[i]!=F1[j]){
          C2.push( [F1[i],F1[j]]);
        }
      }
    }
    this.C2 = C2;

    C2.forEach(element => {
      let testCount = 0;
      this.D.forEach(row => {
        if(element.every(x => row.products.findIndex(y => y.name === x.name) > -1 )){
          testCount++;
        }
      })
      if(testCount>this.frequencyThreshold-1){
        F2.push(element);
      }
    })
    this.F2 = F2;

    for(let i=0;i<F2.length-1;i++){
      for(let j=i+1; j<F2.length;j++){
        if(F2[i][0]===F2[j][0]){
          C3.push(this.arrayUnique(F2[i].concat(F2[j])));
        }
      }
    }
    this.C3 = C3;

    C3.forEach((element,index) => {
      let tmpPairs = [];
      for(let i=0;i<element.length-1;i++){
        for(let j=i+1; j<element.length;j++){
          if(element[i]!=element[j]){
            tmpPairs.push( [element[i],element[j]]);
          }
        }
      }

      tmpPairs.forEach(pairElement => {
        F2.forEach(f2Element => {
          this.arrayUnique(pairElement.concat(f2Element)).length === 2? pairElement.inF2 = true : false;
        })
      })
      if(!tmpPairs.every(x=>x.inF2)){
        C3.splice(index,1);
      }
    });



  }

  arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

}
