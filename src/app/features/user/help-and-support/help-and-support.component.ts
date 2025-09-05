import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrl: './help-and-support.component.scss'
})
export class HelpAndSupportComponent  implements OnInit {
  faq:boolean=false;
  contact:boolean=true;
  resources:boolean=false;
  constructor() { }

  ngOnInit() {
  }

  helpAndSupport(event:any){
    if(event.faq == false){
      this.faq=true;
      this.contact=false;
      this.resources=false;
    }
    else  if(event.faq == false){
      this.contact=true;
      this.faq=false;
      this.resources=false;
    }else if(event.resources == false){
      this.contact=false;
      this.faq=false;
      this.resources=true;

    }else{
      this.contact=true;
      this.faq=false;
      this.resources=false;
    }
  console.log("ev",event.fag)
  }

}
