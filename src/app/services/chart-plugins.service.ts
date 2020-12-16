import { Injectable } from "@angular/core";

// @ts-ignore
import * as outLabels from "chartjs-plugin-piechart-outlabels";

@Injectable({
  providedIn: "root",
})
export class ChartPluginsService {
  public outLabels: any = outLabels;
  constructor() {}
}
