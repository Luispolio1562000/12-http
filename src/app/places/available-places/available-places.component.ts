import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, of, pipe, switchMap, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
  providers: [],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private destroyRef = inject(DestroyRef);
  error = signal('');
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    this.isFetching.set(true)
    /* const data$ = fromFetch('http://localhost:3000/places').pipe(
      switchMap(response => {
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${ response.status }` });
        }
      }),
      catchError (err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );

    data$.subscribe({
      next: result => console.log(result),
      complete: () => console.log('done')
    }); */
    const fetchPlaces = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);

        //console.log(response.body?.places);
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
        console.log('done');
      },
    });

    this.destroyRef.onDestroy(() => {
      fetchPlaces.unsubscribe();
    });
  }

  onSelectPlace(dataPlace: Place) {
    const subscription = this.placesService
      .addPlaceToUserPlaces(dataPlace)
      .subscribe({
        next: (resData) => console.log(resData),
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
