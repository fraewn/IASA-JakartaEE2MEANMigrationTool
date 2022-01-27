export interface globalAnalysisModel{
  "_id" : string,
  "name" : string,
  "label" : string[],
  "triangleScore" : number,
  "triangleCoefficientScore" : number,
  "betweennessCentralityScore" : number,
  "pageRankScore" : number,
  "closenessCentralityScore" : number,
  "classIsEntity" : boolean,
  "reviewNecessary" : boolean,
  "review" : false,
  "_class" : string
}
