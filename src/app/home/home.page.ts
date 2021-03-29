import { Component, ViewChild } from '@angular/core';
import { StorageService, Item } from '../storage.service';
import { Platform, ToastController, IonList } from '@ionic/angular';
// Obs: versões antigas do Ionic, o "IonList" se chama apenas "List".

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: Item[] = [];

  newItem: Item = <Item>{};

  // declarando a lista "mylist" do home-page.html
  @ViewChild('mylist')mylist: IonList;

  constructor(private storageService: StorageService, private plt: Platform, private toastController: ToastController) {
    this.plt.ready().then(() => {
      this.loadItems(); // quando a plataforma for carregada, carregue todos os Items do Storage.
    });
  }
  
  // CREATE
  addItem(){
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();

    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      this.showToast('Item added!');
      this.loadItems(); // Ou somente adicione no array
    });
  }

  // READ
  loadItems(){
    this.storageService.getItems().then(items => {
      this.items = items;
    });
  }

  // UPDATE
  updateItem(item: Item) {
    item.title = `UPDATED: ${item.title}`;
    item.modified = Date.now();

    this.storageService.updateItem(item).then(item => {
      this.showToast('Item updated!');
      this.mylist.closeSlidingItems();
      this.loadItems(); // Ou somente atualize no array
    });
  } 

  // DELETE
  deleteItem(item: Item){
    this.storageService.deleteItem(item.id).then(item => {
      this.showToast('Item removed!');
      this.mylist.closeSlidingItems();
      this.loadItems();
    });
  }

  // Helper (visualização do toastController)
  async showToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
