
import { Component } from '@angular/core';
import { read, utils } from 'xlsx';

interface Options {
  name: string;
  //isValid: (value: string) => boolean;
}

@Component({
  selector: 'app-import-employees',
  templateUrl: './import-employees.component.html',
  styleUrls: ['./import-employees.component.css'],
})
export class ImportEmployeesComponent {

  file?: File;
  fileUploaded: boolean = false;
  parsingFile: boolean = true;
  fileContent: string = '';
  headers: string[] = [];
  allData: string[][] = [];
  data: string[][] = [];
  headersTypes: string[] = [];
  columnsOptions: Options[] = [];
  errors: string = '';
  invalidData: string[][] = [];

  constructor() {
    this.columnsOptions =
      [{ name: 'Name' },
      { name: 'Email' },
      { name: 'Phone' },
      { name: 'Salary' },
      { name: 'Department' }
      ];

  }

  //#region   Reading File Content 
  async onSelectFile(event: any) {
    this.file = event.currentFiles[0];
    if (!this.file)
      return;
    this.fileUploaded = true;
    this.parsingFile = true;
    if (this.file.name.endsWith('xlsx') || this.file.name.endsWith('xls')) {
      this.fileContent = await this.readExcelFileContent(this.file);
    }
    else if (this.file.name.endsWith('csv')) {
      this.fileContent = await this.readCSVFileContent(this.file);
    }
    else {
      throw 'UnKnown File Type'
    }
    this.parsedContent()
    this.parsingFile = false;
  }
  private readCSVFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = (): void => {
        resolve(fr.result as string);
      }
      fr.onerror = (): void => {
        reject('error in reading file');
      }
      fr.readAsText(file);
    });
  }
  private readExcelFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = (): void => {
        const wb = read(fr.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const content = utils.sheet_to_csv(wb.Sheets[sheets[0]]);
          resolve(content);
        }
      }
      fr.onerror = (): void => {
        reject('error in reading file');
      }
      fr.readAsArrayBuffer(file);
    });
  }
  //#endregion 
  private parsedContent() {
    const lines = this.fileContent.split('\n').map(line => line.trim()).filter(l => l.length > 0);
    this.headers = lines[0].split(',');
    this.allData = lines.slice(1).map(row => row.split(','));
    this.data = this.allData;
    this.headersTypes = this.headers.map(h => { return this.columnsOptions.find(o => h.includes(o.name) || o.name.includes(h))?.name || '' });
    this.validateData();
  }

  //#region  Validation 
  validateData() {
    this.errors = "";
    this.invalidData = [];
    let row: string[] = [];
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (!this.checkValid(this.data[i][j], this.headersTypes[j])) {
          row = this.data[i];
          this.errors = "There is some rows has invalid data.";
          this.invalidData.push(row);
          break;
        }
      }
    }
  }
  checkValid(value: string, option: string): boolean {
    option = option.toLocaleLowerCase();
    console.log(value + ' ' + option);
    if (option == 'name' || option == 'email' || option == 'phone') {
      if (value.length <= 0)
        return false;
    }
    if (option == 'salary') {
      if (isNaN(+value))
        return false;
    }
    if (option == 'department') {
      if (!['IS', 'IT', 'CS', 'DS'].includes(value.toUpperCase()))
        return false;
    }
    return true;
  }
  //#endregion

  showAllData() {
    this.data = this.allData;
  }
  showInvalidData() {
    this.data = this.invalidData;
  }
  deleteInvalidData() {
    this.allData = this.allData.filter(r => !this.invalidData.includes(r));
    this.invalidData = [];
    this.errors = "";
    this.showAllData();
  }
  discardFile() {
    this.fileUploaded = false;
    this.parsingFile = false;
    this.fileContent = '';
    this.file = undefined;
    this.headers = [];
    this.data = [];
    this.allData = [];
    this.invalidData = [];
    this.errors = "";
  }

}

