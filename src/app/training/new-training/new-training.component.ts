import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from "@ngrx/store";
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private uiService: UIService, private store: Store<fromTraining.State>) {
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }
}
