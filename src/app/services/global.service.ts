import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  stripe: any;
  elements: any;

  constructor() { }
}
