import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../Model/Task';
import { TaskService } from '../../Services/task.service';
import { Subscription } from 'rxjs';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { SnackbarComponent } from '../../utility/snackbar/snackbar.component';
import { LoaderComponent } from '../../utility/loader/loader.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CreateTaskComponent,
    TaskDetailsComponent,
    SnackbarComponent,
    LoaderComponent,
    NgFor,
    NgClass,
    NgIf,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);
  currentTaskId: string = '';
  isLoading: boolean = false;
  showNoTaskCreatedYet: boolean = false;
  setTimeoutTimer: any = setTimeout(() => {});

  currentTask: Task | null = null;

  errorMessage: string | null = null;

  editMode: boolean = false;
  selectedTask: Task;

  errorSub: Subscription;

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: '',
      desc: '',
      assignedTo: '',
      createdAt: '',
      priority: '',
      status: '',
    };
  }

  FetchAllTaskClicked() {
    if (this.allTasks.length != 0) {
      this.fetchAllTasks();
    } else {
      this.taskService.errorSubject.next({
        error: {
          error: 'No Task To Fetch',
        },
      });
    }
  }

  showCurrentTaskDetails(id: string | undefined) {
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      },
    });
  }

  CloseTaskDetails() {
    this.showTaskDetails = false;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task) {
    this.isLoading = true;
    if (!this.editMode) {
      this.showNoTaskCreatedYet = false;
      this.taskService.CreateTask(data).subscribe({
        next: () => {
          this.fetchAllTasks();
        },
        error: (err) => {
          this.taskService.errorSubject.next(err);
        },
      });
    } else {
      this.taskService.UpdateTask(this.currentTaskId, data).subscribe({
        next: () => {
          this.fetchAllTasks();
        },
        error: (err) => {
          this.taskService.errorSubject.next(err);
        },
      });
    }
  }

  private fetchAllTasks() {
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
        this.showNoTaskCreatedYet = true;
      },
      error: (error) => {
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(err: any) {
    clearTimeout(this.setTimeoutTimer);

    if (
      err.error.error === 'Permission denied' ||
      err.error.error === '404 Not Found'
    ) {
      this.errorMessage = 'You do not have permisssion to perform this action';
    } else if (err.error.error === 'No Task To Delete') {
      this.errorMessage = 'Not a single task here to delete.';
    } else if (err.error.error === 'No Task To Fetch') {
      this.errorMessage = 'Not a single task here to fetch.';
    } else {
      this.errorMessage = err.message;
    }

    this.setTimeoutTimer = setTimeout(() => {
      this.errorMessage = null;
    }, 2980);
  }

  DeleteTask(id: string | undefined) {
    this.isLoading = true;
    this.taskService.DeleteTask(id).subscribe({
      next: () => {
        this.fetchAllTasks();
      },
      error: (err) => {
        this.taskService.errorSubject.next(err);
      },
    });
  }

  DeleteAllTask() {
    if (this.allTasks.length != 0) {
      this.isLoading = true;
      if (this.allTasks.length != 0) {
        this.taskService.DeleteAllTasks().subscribe({
          next: () => {
            this.fetchAllTasks();
          },
          error: (err) => {
            this.taskService.errorSubject.next(err);
          },
        });
      }
    } else {
      this.taskService.errorSubject.next({
        error: {
          error: 'No Task To Delete',
        },
      });
    }
  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;

    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }
}
