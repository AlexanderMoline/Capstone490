import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'http://localhost:3000';

  searchMissingResult: Observable<any[]> | null = null;
  searchUnidentifiedResult: Observable<any[]> | null = null;

  constructor(private http: HttpClient) {}

  getData(url: string) {
    this.searchMissingResult = this.http.get<any[]>(url);
  }

  getPairDetails(mp: string, up: string) {
    return this.http.get<{ missing_person: any; unidentified_person: any }>(
      `${this.baseUrl}/persons/${mp}/${up}`,
    );
  }

  /** Holds the last comparison search parameters */
  comparisonParams = new Map<string, string>();

  /** Save the map of params for /persons/search */
  saveComparisonParams(params: Map<string, string>) {
    this.comparisonParams = new Map(params);
  }

  /** Call /persons/search with the saved params */
  getComparisonResults(): Observable<{
    missing_persons: any[];
    unidentified_persons: any[];
  }> {
    const url = this.constructSearchUrl(this.comparisonParams, 'persons');
    return this.http.get<{
      missing_persons: any[];
      unidentified_persons: any[];
    }>(url);
  }

  getCaseDetails(caseNumber: string): Observable<any> {
    var table = caseNumber.slice(0, 2).toLowerCase();

    const url = `${this.baseUrl}/${table}/${caseNumber}`;
    return this.http.get<any>(url);
  }

  constructSearchUrl(parameters: Map<string, string>, table: string): string {
    var url = this.baseUrl + `/${table}/search?`;
    for (var parameter of parameters) {
      if (parameter[1] != '') {
        var encodeSpaces = parameter[1].replaceAll(' ', '%20');
        url += `${parameter[0]}=${encodeSpaces}&`;
      }
    }
    if (url.endsWith('&')) {
      url = url.substring(0, url.length - 1);
    }

    return url;
  }
}
