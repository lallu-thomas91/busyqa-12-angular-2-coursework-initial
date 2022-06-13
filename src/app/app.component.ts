import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Task } from './task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient){

  }

  ngOnInit(): void{

    this.fetchTasks();
  }
  
  task: Task = <Task>{};
  tasks: Task[] = [];

  show: boolean = false;
  mode: string = '';

  onAddTask(task: Task){

    // this.tasks.push(this.task);
    this.createTask(task);

    this.mode = 'added';
    this.show = true;
    setTimeout(() => {
      this.show = false}, 5000);

  }

  onRemove(index: number){

    // this.tasks.splice(index,1);
    this.deleteTask(this.tasks[index].idTask as string);

    this.mode = 'removed';
    this.show = true;
    setTimeout(() => {
      this.show = false}, 5000);
      
  }

  createTask(task: Task){
    this.http.post('https://testbusyqaforlallu-default-rtdb.firebaseio.com/Tasks.json', task)
              .subscribe(() => {
                this.fetchTasks();
              });
  }

  fetchTasks(){
    this.http.get<{[key: string]:Task}>('https://testbusyqaforlallu-default-rtdb.firebaseio.com/Tasks.json')
              .pipe(
                map((responseData) => {
                  const taskArray = [];
                  for(const key in responseData){
                    if(responseData.hasOwnProperty(key)){
                      taskArray.push({...responseData[key], idTask: key })
                    }
                  }
                  return taskArray;
                })
              )
              .subscribe((tasks) => {
                console.log(tasks);
                this.tasks = tasks;                                       
              });
              
  }

  deleteTask(idTask: string){
    this.http.delete(`https://testbusyqaforlallu-default-rtdb.firebaseio.com/Tasks/${ idTask }.json`)
              .subscribe(() => {
                this.fetchTasks();
              })
  }

}
