import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../Model/Task';
import { TaskService } from '../../Services/task.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  inprogress: number = 0;
  open: number = 0;
  started: number = 0;
  complete: number = 0;
  total: number = 0;
  tasks: Task[] = [];

  taskService: TaskService = inject(TaskService);

  ngOnInit() {
    this.taskService.GetAlltasks().subscribe((taskList: Task[]) => {
      this.tasks = taskList;
      this.total = taskList.length;
      this.open = taskList.filter((x) => x.status === 'open').length;
      this.started = taskList.filter((x) => x.status === 'started').length;
      this.inprogress = taskList.filter(
        (x) => x.status === 'in-progress'
      ).length;
      this.complete = taskList.filter((x) => x.status === 'complete').length;
    });
  }
}
