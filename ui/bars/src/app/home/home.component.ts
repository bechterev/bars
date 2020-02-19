import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { first,map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../models/user.model';
import {Document} from '../models/document.model';
import {  AuthenticationService } from '../services/authentication.service';
import {UserService} from '../services/user.service';



@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.scss'] ,
changeDetection: ChangeDetectionStrategy.OnPush})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    upform: FormGroup;
    currentUserSubscription: Subscription;
    documents: Document[] = [];
    filesUpload: Observable<Document[]>;
    oneDoc:Document;
    upResponse = { status: '', message: '', filePath: '' };
    error: string;
    constructor(private formBuilder:FormBuilder,
        private cd: ChangeDetectorRef,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            console.log('test',user.id)
        });
    }

    ngOnInit() {
        this.upform = this.formBuilder.group({
            document: ['']
          });
        this.filesUpload = this.userService.getAll()
        console.log(this.filesUpload)
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteDocument(id: number) {
        this.userService.delete(id).pipe(first()).subscribe((res) => {
            this.cd.detectChanges();
            this.loadAllDocuments();
            console.log(res);
        });
    }

    private loadAllDocuments() {
        this.userService.getAll().pipe(first()).subscribe(documents => {
            this.documents = documents;
            console.log(documents);
        });
    }
    updateDocument(id: number) { 
        this.userService.getAll().pipe(first()).subscribe(d=>{
            d.map(x=>{if(x.id==id){ this.oneDoc=x;}});
        })
    }
    onFileChange(event) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.upform.get('document').setValue(file);
        }
      }
      Save() {
        const formData = new FormData();
        formData.append('file', this.upform.get('document').value);
        formData.append('document',JSON.stringify(this.oneDoc));
        this.userService.updateDoc(this.oneDoc.id,formData)
        .subscribe(res=>{
            this.filesUpload = this.userService.getAll();
        },err=>{console.log(err)});
      }
      downloadFile(file){
          let oo=new Uint8Array(file.data.data);
  
          let f=new File([oo],file.name+'.'+file.type);
        let url = ( window.URL).createObjectURL(f);
        let pwa = window.open(url);

          
      }
}