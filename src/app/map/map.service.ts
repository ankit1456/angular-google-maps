import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getIpAddress() {
    return this.http
      .get('https://api.ipify.org/?format=json')
      .pipe(catchError(this.handleError));
  }

  getGEOLocation(ip: any) {
    // Update your api key to get from https://ipgeolocation.io
    let url =
      'https://api.ipgeolocation.io/ipgeo?apiKey=1b4e13815c9249b89e323d1e95407dd9&ip=' +
      ip;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
