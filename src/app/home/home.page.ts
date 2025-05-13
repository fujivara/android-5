import { Component, OnInit, OnDestroy } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface AccelerationData {
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  private accelerationSubject = new BehaviorSubject<AccelerationData | null>(null);
  acceleration$: Observable<AccelerationData | null> = this.accelerationSubject.asObservable();

  constructor() {}

  ngOnInit() {
    this.startWatching();
  }

  ngOnDestroy() {
    this.stopWatching();
  }

  private startWatching() {
    from(Motion.addListener('accel', (event: { acceleration: AccelerationData }) => {
      this.accelerationSubject.next(event.acceleration);
    })).pipe(
      catchError((error: Error) => {
        console.error('Error starting accelerometer:', error);
        return of(null);
      })
    ).subscribe();
  }

  private stopWatching() {
    from(Motion.removeAllListeners()).pipe(
      catchError((error: Error) => {
        console.error('Error stopping accelerometer:', error);
        return of(null);
      })
    ).subscribe();
  }
}
