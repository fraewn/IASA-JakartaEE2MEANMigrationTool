import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {SplittingResult} from "../entity-splitting/entity-splitting.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class ModuleIdentService{
  private BACKEND_URL_FINAL_MODULES_ADD = environment.backend_final_modules + "/add";
  private BACKEND_URL_FINAL_MODULES_GET = environment.backend_final_modules + "/get";
  private BACKEND_URL_FINAL_MODULES_DELETE = environment.backend_final_modules + "/delete";

  constructor(private http: HttpClient, private router: Router) {}

  private splittingResultUpdated = new Subject<{splittingResult : SplittingResult[]}>()

  getSplittingResultUpdateListener(){
    return this.splittingResultUpdated.asObservable();
  }

  addFinaleModule(moduleKnowledge){
    const body = moduleKnowledge;
    this.http.post(
      this.BACKEND_URL_FINAL_MODULES_ADD, body).pipe(map(response => ({
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

  deleteModule(moduleKnowledge){
    const body = moduleKnowledge;
    this.http.post(
      this.BACKEND_URL_FINAL_MODULES_DELETE, body).pipe(map(response => ({
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

  deleteComponentInModule(base, component){

  }

  getAllFinaleModules(){
    this.http.get(
      this.BACKEND_URL_FINAL_MODULES_GET).pipe(map(response => ({
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
