import { Component, OnInit } from '@angular/core';
import { Todo } from '../services/todo';
import { Task } from '../models/task.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit {
  tasks: Task[] = [];

  constructor(private todoService: Todo, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.todoService.getTasks().subscribe(res => {
      this.tasks = res;
    });
  }

  getTasksByPriority(priority: string) {
    return this.tasks.filter(t => t.priority === priority);
  }

  getPriorityColor(priority: string) {
    switch(priority) {
      case 'urgente': return 'danger';
      case 'secundaria': return 'warning';
      case 'largo-plazo': return 'success';
      default: return 'medium';
    }
  }

  async openAddModal() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título' },
        { name: 'description', type: 'text', placeholder: 'Descripción' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Siguiente', 
          handler: (data) => this.selectPriority(data) 
        }
      ]
    });
    await alert.present();
  }

  async selectPriority(data: any) {
    const alert = await this.alertCtrl.create({
      header: 'Prioridad',
      inputs: [
        { name: 'priority', type: 'radio', label: 'Urgente', value: 'urgente', checked: true },
        { name: 'priority', type: 'radio', label: 'Secundaria', value: 'secundaria' },
        { name: 'priority', type: 'radio', label: 'Largo Plazo', value: 'largo-plazo' },
      ],
      buttons: [
        {
          text: 'Guardar',
          handler: (priority) => {
            this.todoService.addTask({
              title: data.title,
              description: data.description,
              priority: priority,
              status: 'pendientes',
              createdAt: Date.now()
            });
          }
        }
      ]
    });
    await alert.present();
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id);
  }
}