import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  error = signal('');
  places = this.placesService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
        console.log('done');
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  deletePlaceSelect(dataPlace: Place) {
    const subscription =  this.placesService.removeUserPlace(dataPlace).subscribe()
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
