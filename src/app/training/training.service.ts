import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Observable, map, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from "../shared/ui.actions";
import * as Training from "./training.actions";
import * as fromTraining from "./training.reducer";
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) {
  }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges().pipe((map(actions => actions.map(m => {
      var id = m.payload.doc.id;
      var data: any = m.payload.doc.data();
      var result = {
        id: id,
        ...data
      };
      console.log(result);
      return result;
    })))).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new UI.StopLoading);
      this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
    }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
      this.addDataToDatabase({ ...exercise, date: new Date(), state: 'completed' });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
      this.addDataToDatabase({
        ...exercise,
        duration: exercise.duration * (progress / 100),
        calories: exercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().pipe((exercises) => {
      var e = <Observable<Exercise[]>>exercises;
      return e;
    }).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
