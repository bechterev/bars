import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { User } from '../models/user.model';
import {Document} from '../models/document.model';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Document[]>(`http://localhost:3000/api/documents`);
    }

    getById(id: number) {
        return this.http.get(`http://localhost:3000/api/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`http://localhost:3000/api/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`http://localhost:3000/api/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`http://localhost:3000/api/documents/${id}`);
    }
    upload(data){
        let uploadURL = `http://localhost:3000/api/upload`;


    return this.http.post<any>(uploadURL, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
    }
    updateDoc(id:number,data?){
    
      return this.http.put<any>(`http://localhost:3000/api/upload/${id}`,data,
      {
        reportProgress: true
      })
    }

}