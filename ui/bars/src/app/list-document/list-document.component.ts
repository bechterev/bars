import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {UserService} from '../services/user.service';
import {Document} from '../models/document.model';

@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.scss']
})
export class ListDocumentComponent implements OnInit {

  showFile = false;
  fileUploads: Observable<Document[]>;
 
  constructor(private uploadService: UserService) { }
 
  ngOnInit() {
    this.fileUploads = this.uploadService.getAll();
      console.log(this.fileUploads)
  }
 


}
