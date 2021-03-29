import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// Obs: versões antigas do Ionic, a library "storage-angular" se chama apenas "storage".

// exportando interface de dados (pode ser alterada conforme necessidade)
export interface Item {
  id: number,
  title: string,
  value: string,
  modified: number
}

const ITEMS_KEY = "my-items";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // criando o storage
  constructor(private storage: Storage) { 
    this.init();
  }

  // iniciando o storage
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.storage = storage;
  }

  // CREATE
  addItem(item: Item): Promise<any>{
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if(items){
        items.push(item);
        return this.storage.set(ITEMS_KEY, items);
      }else{
        return this.storage.set(ITEMS_KEY, [item]);
      }
    });
  }

  // READ
  getItems(): Promise<Item[]>{
    return this.storage.get(ITEMS_KEY);
  }

  // UPDATE
  updateItem(item: Item): Promise<any>{
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if(!items || items.length === 0){
        return null;
      }

      let newItems: Item[] = [];

      for(let i of items){
        if (i.id === item.id){
          newItems.push(item);
        }else{
          newItems.push(i);
        }
      }

      return this.storage.set(ITEMS_KEY, newItems);
    });
  }

  // DELETE
  deleteItem(id: number): Promise<Item>{
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if(!items || items.length == 0){
        return null;
      }

      let toKeep: Item[] = [];

      for(let i of items){
        if(i.id !== id){
          toKeep.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }
}
