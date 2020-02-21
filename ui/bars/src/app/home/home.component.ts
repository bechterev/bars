import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../models/user.model';
import {Document} from '../models/document.model';
import {  AuthenticationService } from '../services/authentication.service';
import {UserService} from '../services/user.service';
import * as moment from 'moment';


@Component({ templateUrl: 'home.component.html',
styleUrls: ['./home.component.scss'] })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    upform: FormGroup;
    currentUserSubscription: Subscription;
    documents: Document[] = [];
    filesUpload: Observable<Document[]>;
    oneDoc: Document;
    upResponse = { status: '', message: '', filePath: '' };
    error: string;
    constructor(private formBuilder: FormBuilder,

                private authenticationService: AuthenticationService,
                private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            console.log('test', user.id);
        });
    }

    ngOnInit() {
        this.upform = this.formBuilder.group({
            document: ['']
          });
        this.filesUpload = this.userService.getAll();
        console.log(this.filesUpload);
		      this.loadAllDocuments();
    }
	   childStatusChanged(finished: boolean) {
        if (finished) {
          this.loadAllDocuments();
        }
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteDocument(id: number) {
        this.userService.delete(id).pipe(first()).subscribe((res) => {
            this.loadAllDocuments();
        });
    }

    private loadAllDocuments() {
        this.userService.getAll().pipe(first()).subscribe(document => {
            document.map(x=>{x.date=moment(x.date).format('DD.MM.YYYY hh:mm')});
            this.documents = document;
        });
    }
    updateDocument(id: number) {
        this.userService.getAll().pipe(first()).subscribe(d => {

            d.map(x => {if (x.id == id) {x.date = moment(x.date).format('DD.MM.YYYY hh:mm') ; this.oneDoc = x; }});
			         this.loadAllDocuments();
        });
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
        formData.append('document', JSON.stringify(this.oneDoc));
        this.userService.updateDoc(this.oneDoc.id, formData)
        .subscribe(res => {
            this.loadAllDocuments();
        }, err => {console.log(err); });
      }
      downloadFile(file) {
          const oo = new Uint8Array(file.data.data);

          const f = new File([oo], file.name + '.' + file.type);
          const url = ( window.URL).createObjectURL(f);
          const pwa = window.open(url);


      }
}
