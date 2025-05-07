import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonGrid, IonRow } from '@ionic/angular/standalone';
import { Bar } from '../bar';
import { FormsModule } from '@angular/forms';
import { BarService } from '../bar.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, cart, ellipsisHorizontal, barChart, documentOutline } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow
  ],
})
export class Tab1Page {
  bars: Bar[] = [];
  huur: Bar = new Bar('Huur');
  bood: Bar = new Bar('Boodschappen');
  overig: Bar = new Bar('Overige');

  fileContent: string | null = null;

  constructor(private barService: BarService, private router: Router) {
    addIcons({home, cart, ellipsisHorizontal, barChart, documentOutline});
  }

  async pickFile() {
    try {
      const result = await FilePicker.pickFiles({
        readData: true, 
        types: ['*.txt*'],
      });

      if (result.files.length > 0) {
        const file = result.files[0];

        if (file.data) {
          const decodedData = atob(file.data);
          this.fileContent = decodedData;

          const lines = this.fileContent.split('\n');
          this.splitLines(lines[0], this.huur);
          this.splitLines(lines[1], this.bood);
          this.splitLines(lines[2], this.overig);

          this.onSubmit();
        }
      }
    } catch (error) {
      console.error('File selection error:', error);
    }
  }

  splitLines(line: string, bar: Bar): void {
    const splits = line.split(",");
  
    const numberMatch = splits[0].match(/\d+/); 
    const colorMatch = splits[1]?.match(/#[0-9A-Fa-f]{6}/); 
    
    if (numberMatch && colorMatch) {
      bar.amount = parseInt(numberMatch[0], 10);  
      bar.color = colorMatch[0];                  
    }
  }

  onSubmit(): void {
    this.bars.push(this.huur, this.bood, this.overig);
    this.barService.setBar(this.bars);
    this.bars = [];
    this.router.navigate(['/tabs/tab2']);
  }
}
