import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../Model/Task';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  errorSubject = new Subject<any>();
  authService: AuthService = inject(AuthService);

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ 'my-header': 'hello-world' });
    return this.http.post<{ name: string }>(
      environment.firebaseRealtimeDataBaseApiKey + 'tasks.json',
      task,
      { headers: headers }
    );
  }

  DeleteTask(id: string | undefined) {
    return this.http.delete(
      environment.firebaseRealtimeDataBaseApiKey + 'tasks/' + id + '.json'
    );
  }

  DeleteAllTasks() {
    return this.http.delete(
      environment.firebaseRealtimeDataBaseApiKey + 'tasks.json',
      { observe: 'response', responseType: 'json' }
    );
  }

  GetAlltasks() {
    return this.http
      .get(environment.firebaseRealtimeDataBaseApiKey + 'tasks.json')
      .pipe(
        map((response) => {
          //TRANSFORM DATA
          let tasks = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              tasks.push({ ...response[key], id: key });
            }
          }

          return tasks;
        })
      );
  }

  UpdateTask(id: string | undefined, data: Task) {
    return this.http.put(
      environment.firebaseRealtimeDataBaseApiKey + 'tasks/' + id + '.json',
      data
    );
  }

  getTaskDetails(id: string | undefined) {
    return this.http
      .get(environment.firebaseRealtimeDataBaseApiKey + 'tasks/' + id + '.json')
      .pipe(
        map((response) => {
          let task = {};
          task = { ...response, id: id };
          return task;
        })
      );
  }
}
