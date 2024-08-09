import { Component, input, OnInit, output } from '@angular/core';

import { Place } from './place.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent  {
  places = input.required<Place[]>();
  selectPlace = output<Place>();
  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }




}
