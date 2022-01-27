import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class GlobalAnalysisService{
  private BACKEND_URL = environment.backend + "/globalAnalysis";

  constructor(private http: HttpClient, private router: Router) {}

  getCompany(companyId: string) {
    return this.http.get<{
      _id: string,
      companyName: string,
      businessType: string,
      foundationDate: Date,
      principalOfficeLocation: string,
      creator: string
    }>(
      this.BACKEND_URL + "/" + companyId
    );
  }

}
