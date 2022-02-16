export interface SplittingResult{
  moduleCluster : string[],
  splittingStrategy : string,
  base : String,
  usage?: string,
  usedModules? : string[]
}
