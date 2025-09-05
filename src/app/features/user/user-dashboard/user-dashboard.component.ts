import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent  implements OnInit {
  items = ['Left Item', 'Draggable Item', 'Right Item'];


  @ViewChild('leftItem', {static: false}) leftItem!: ElementRef;
  @ViewChild('middleItem', {static: false}) middleItem!: ElementRef;
  @ViewChild('rightItem', {static: false}) rightItem!: ElementRef;


  isMoving: boolean = false;
  startX: number = 0;
  signUpAs?: string;

  constructor(private _router:Router) { }
  ngOnInit() {
    this.signUpAs = localStorage.getItem('signUpAs') ?? '';

  }


  startMoving(event: MouseEvent) {
    this.isMoving = true;
    this.startX = event.clientX;
  }

  stopMoving() {
    this.isMoving = false;
    this.checkCollision();
  }

  onMouseMove(event: MouseEvent) {
    if (this.isMoving) {
      const currentX = event.clientX;
      const deltaX = currentX - this.startX;
      const middleItemLeft = this.middleItem.nativeElement.offsetLeft + deltaX;

      this.middleItem.nativeElement.style.left = middleItemLeft + 'px';
      this.startX = currentX;
    }
  }

  checkCollision() {
    const middleRect = this.middleItem.nativeElement.getBoundingClientRect();
    const leftRect = this.leftItem.nativeElement.getBoundingClientRect();
    const rightRect = this.rightItem.nativeElement.getBoundingClientRect();

    if (
      middleRect.right >= leftRect.left &&
      middleRect.left <= leftRect.right &&
      middleRect.bottom >= leftRect.top &&
      middleRect.top <= leftRect.bottom
    ) {
      this._router.navigate(['/rider'])
    } else if (
      middleRect.right >= rightRect.left &&
      middleRect.left <= rightRect.right &&
      middleRect.bottom >= rightRect.top &&
      middleRect.top <= rightRect.bottom
    ) {
      this._router.navigate(['/rider-later'])
    }
  }


 


  navigateToRoute(route: string) {
    this._router.navigate([route]);
  }

}
