import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlaceSearchResult } from '../place-and-time/place-and-time.component';

@Component({
  selector: 'app-map-details',
  templateUrl: './map-details.component.html',
  styleUrl: './map-details.component.scss'
})
export class MapDetailsComponent implements OnInit {
  @Input() data: PlaceSearchResult | undefined;

  ngOnInit(): void {
  }
}
