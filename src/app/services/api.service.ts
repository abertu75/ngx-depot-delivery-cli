import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const TEST_API = 'api/v1/order';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient
  ) { }



  public orders(

  ): Observable<any> {
    return this.httpClient.get<any>(
      this._buildApiurl(environment.apiEndpoint, TEST_API)
    )

  }



  private _buildApiurl(basePath: string, api: string): string {
    return Location.joinWithSlash(basePath, api);
  }
}
