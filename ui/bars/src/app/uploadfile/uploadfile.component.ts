import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserService} from '../services/user.service';
import { IMyDpOptions } from 'mydatepicker';
import {Document} from '../models/document.model';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss']
})
export class UploadfileComponent implements OnInit {
  form: FormGroup;
  error: string;
  @Input() userId: number ;
  Doc: Document=new Document();
  _name:string;
  _number:Number;
  _note:string;
  _date:string;
  original_name:string;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy hh:mm',
};

  uploadResponse = { status: '', message: '', filePath: '' };

  constructor(private formBuilder: FormBuilder, private usservice: UserService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      document: ['']
    });
 
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.original_name=file.name;
      this.form.get('document').setValue(file);
    }
  }

 



  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.form.get('document').value);
    let n=formData.get('file');
    
    this.Doc.user_id=this.userId;
    
    this.Doc.type=this.original_name.substring(this.original_name.lastIndexOf('.')+1, this.original_name.length);
    console.log(this.Doc.type);
    this.Doc.date=this._date;
    this.Doc.name=this._name;
    this.Doc.note=this._note;
    this.Doc.number_document=this._number as Number;
    formData.append('document',JSON.stringify(this.Doc));
    this.usservice.upload(formData).subscribe(
      (res) => this.uploadResponse = res,
      (err) => this.error = err
    );
  }

}
