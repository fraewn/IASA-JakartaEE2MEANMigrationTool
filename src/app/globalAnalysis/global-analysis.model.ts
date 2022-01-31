export interface NodeKnowledge{
  "name" : string,
  "label" : string[],
  "triangleScore" : number,
  "triangleCoefficientScore" : number,
  "betweennessCentralityScore" : number,
  "pageRankScore" : number,
  "closenessCentralityScore" : number,
  "classIsEntity" : boolean,
  "representedEntity" : string,
  "keywords" : string[],
  "associatedLayers" : string[],
  "calculatedInterpretation" : string,
  "reviewNecessary" : boolean,
  "review" : false,
  "representedMeanModuleType" : string,
  "associatedMeanModuleType" : string
}
