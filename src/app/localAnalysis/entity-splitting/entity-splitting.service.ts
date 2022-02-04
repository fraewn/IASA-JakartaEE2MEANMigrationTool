import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {EntitySplittingProfileModel} from "./entity-splitting-profile.model";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class EntitySplittingService{
  private entitySplittingProfileUpdated = new Subject<{entitySplittingProfile : EntitySplittingProfileModel[]}>();

  private BACKEND_URL_CURRENT_PROFILE = environment.backend_splitting + "/profile/current";
  private BACKEND_URL_INSERT_PROFILE = environment.backend_splitting + "/profile/update"

  constructor(private http: HttpClient, private router: Router) {}

  getEntitySplittingProfileUpdateListener(){
    return this.entitySplittingProfileUpdated.asObservable();
  }

  requestCurrentEntitySplittingProfile(){
    this.http.get(
      this.BACKEND_URL_CURRENT_PROFILE).pipe(map(response => ({
      entitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedEntitySplittingProfile : EntitySplittingProfileModel[] = [];
      for(let i in objectArr.entitySplittingProfileArray){
        let profile : EntitySplittingProfileModel = {
          allowedJavaEEComponents: [],
          centralJavaEEComponent: "",
          filteredJavaEEComponents: [],
          searchDepth: 0,
          substitutionalCentralJavaEEComponent: ""
        }
        profile.allowedJavaEEComponents = objectArr.entitySplittingProfileArray[i].allowedJavaEEComponents
        profile.filteredJavaEEComponents = objectArr.entitySplittingProfileArray[i].filteredJavaEEComponents
        profile.centralJavaEEComponent = objectArr.entitySplittingProfileArray[i].centralJavaEEComponent
        profile.substitutionalCentralJavaEEComponent = objectArr.entitySplittingProfileArray[i].substitutionalCentralJavaEEComponent
        profile.searchDepth= objectArr.entitySplittingProfileArray[i].searchDepth
        transformedEntitySplittingProfile.push(profile);
      }
      this.entitySplittingProfileUpdated.next({entitySplittingProfile : transformedEntitySplittingProfile });
    });
  }

  requestUpdateSplittingStrategy(entitySplittingProfiles) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json')
    const body = JSON.stringify(entitySplittingProfiles);
    this.http.post(
      this.BACKEND_URL_INSERT_PROFILE, body, {
        headers: headers
      }).pipe(map(response => ({
      entitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedEntitySplittingProfile : EntitySplittingProfileModel[] = [];
      for(let i in objectArr.entitySplittingProfileArray){
        let profile : EntitySplittingProfileModel = {
          allowedJavaEEComponents: [],
          centralJavaEEComponent: "",
          filteredJavaEEComponents: [],
          searchDepth: 0,
          substitutionalCentralJavaEEComponent: ""
        }
        profile.allowedJavaEEComponents = objectArr.entitySplittingProfileArray[i].allowedJavaEEComponents
        profile.filteredJavaEEComponents = objectArr.entitySplittingProfileArray[i].filteredJavaEEComponents
        profile.centralJavaEEComponent = objectArr.entitySplittingProfileArray[i].centralJavaEEComponent
        profile.substitutionalCentralJavaEEComponent = objectArr.entitySplittingProfileArray[i].substitutionalCentralJavaEEComponent
        profile.searchDepth= objectArr.entitySplittingProfileArray[i].searchDepth
        transformedEntitySplittingProfile.push(profile);
      }
      this.entitySplittingProfileUpdated.next({entitySplittingProfile : transformedEntitySplittingProfile });
    });
  }


}
