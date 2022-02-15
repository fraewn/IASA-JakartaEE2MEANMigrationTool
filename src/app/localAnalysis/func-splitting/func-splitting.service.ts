import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {EntitySplittingProfileModel} from "../entity-splitting/entity-splitting-profile.model";
import {SplittingResult} from "../entity-splitting/entity-splitting.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class FuncSplittingService{
  private functionalitySplittingProfileUpdated = new Subject<{entitySplittingProfile : EntitySplittingProfileModel[]}>();
  private splittingResultUpdated = new Subject<{splittingResult : SplittingResult[]}>()

  private BACKEND_URL_EXECUTE_ENTITY_SPLITTING  = environment.backend_splitting_func + "/execute";
  private BACKEND_URL_ENTITY_SPLITTING_RESULT  = environment.backend_splitting_func + "/execute/result";
  private BACKEND_URL_DELETE_COMPONENT_IN_MODULE  = environment.backend_splitting_func + "/execute/result/delete/component";
  private BACKEND_URL_DELETE_MODULE  = environment.backend_splitting_func + "/execute/result/delete/module";

  constructor(private http: HttpClient, private router: Router) {}

  getEntitySplittingProfileUpdateListener(){
    return this.functionalitySplittingProfileUpdated.asObservable();
  }

  getSplittingResultUpdateListener(){
    return this.splittingResultUpdated.asObservable();
  }

  navigateToFunctionalitySplittingResults(){
    this.requestExecuteFunctionalitySplittingStrategy();
    this.router.navigate(["/splitting/functionality/result"]);
  }

  requestDeleteComponentInModule(base, component){
    const queryParams = `?base=${base}&component=${component}`;
    this.http.get(
      this.BACKEND_URL_DELETE_COMPONENT_IN_MODULE + queryParams).pipe(map(response => ({
      functionalitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedSplittingResult : SplittingResult[] = [];
      for(let i in objectArr.functionalitySplittingProfileArray){
        let splittingResult : SplittingResult = {
          base: "", moduleCluster: [], splittingStrategy: ""
        }
        splittingResult.base = objectArr.functionalitySplittingProfileArray[i].base
        splittingResult.moduleCluster= objectArr.functionalitySplittingProfileArray[i].moduleCluster
        splittingResult.splittingStrategy = objectArr.functionalitySplittingProfileArray[i].splittingStrategy
        transformedSplittingResult.push(splittingResult);
      }
      this.splittingResultUpdated.next({splittingResult : transformedSplittingResult });
    });
  }

  requestFunctionalitySplittingStrategyResults(){
    this.http.get(
      this.BACKEND_URL_ENTITY_SPLITTING_RESULT).pipe(map(response => ({
      functionalitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedSplittingResult : SplittingResult[] = [];
      for(let i in objectArr.functionalitySplittingProfileArray){
        let splittingResult : SplittingResult = {
          base: "", moduleCluster: [], splittingStrategy: ""
        }
        splittingResult.base = objectArr.functionalitySplittingProfileArray[i].base
        splittingResult.moduleCluster= objectArr.functionalitySplittingProfileArray[i].moduleCluster
        splittingResult.splittingStrategy = objectArr.functionalitySplittingProfileArray[i].splittingStrategy
        transformedSplittingResult.push(splittingResult);
      }
      this.splittingResultUpdated.next({splittingResult : transformedSplittingResult });
    });
  }

  requestExecuteFunctionalitySplittingStrategy(){
    this.http.get(
      this.BACKEND_URL_EXECUTE_ENTITY_SPLITTING).pipe(map(response => ({
      functionalitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedSplittingResult : SplittingResult[] = [];
      for(let i in objectArr.functionalitySplittingProfileArray){
        let splittingResult : SplittingResult = {
          base: "", moduleCluster: [], splittingStrategy: ""
        }
        splittingResult.base = objectArr.functionalitySplittingProfileArray[i].base
        splittingResult.moduleCluster= objectArr.functionalitySplittingProfileArray[i].moduleCluster
        splittingResult.splittingStrategy = objectArr.functionalitySplittingProfileArray[i].splittingStrategy
        transformedSplittingResult.push(splittingResult);
      }
      this.splittingResultUpdated.next({splittingResult : transformedSplittingResult });
    });
  }

  requestDeleteModule(base: any) {
    const queryParams = `?base=${base}`;
    this.http.get(
      this.BACKEND_URL_DELETE_MODULE + queryParams).pipe(map(response => ({
      functionalitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedSplittingResult : SplittingResult[] = [];
      for(let i in objectArr.functionalitySplittingProfileArray){
        let splittingResult : SplittingResult = {
          base: "", moduleCluster: [], splittingStrategy: ""
        }
        splittingResult.base = objectArr.functionalitySplittingProfileArray[i].base
        splittingResult.moduleCluster= objectArr.functionalitySplittingProfileArray[i].moduleCluster
        splittingResult.splittingStrategy = objectArr.functionalitySplittingProfileArray[i].splittingStrategy
        transformedSplittingResult.push(splittingResult);
      }
      this.splittingResultUpdated.next({splittingResult : transformedSplittingResult });
    });
  }
}
