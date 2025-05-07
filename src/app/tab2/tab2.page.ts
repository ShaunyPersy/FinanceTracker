import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonContent,IonHeader,IonToolbar,IonTitle,IonGrid,IonRow,IonCol,IonList,IonItem,IonIcon,IonText, IonButton, IonModal, IonButtons, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { BarService } from '../bar.service';
import { Bar } from '../bar';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { square } from 'ionicons/icons';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import { Platform } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonInput, IonButtons, IonModal, IonButton, 
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonIcon,
    IonText,
    IonButton,
    IonModal,
    ExploreContainerComponent, CommonModule, FormsModule]
})
export class Tab2Page {
  bars: Bar[] = [];
  numbers: number[] = Array.from({length: 11}, (_, i) => i * 150);
  fileName: string = "";
  
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;

  barSubscription!: Subscription;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  constructor(private barService: BarService, private platform: Platform) {
    addIcons({ square });
    this.bars = this.barService.bars;
  }

  ngOnInit() {
    this.barSubscription = this.barService.getBar()
    .subscribe(bars => {
      console.log("Received bars:", bars);
      this.bars = bars;
    });
    this.numbers = this.numbers.reverse();
  }

  ngOnDestroy() {
    if (this.barSubscription) {
      this.barSubscription.unsubscribe();
    }
  }

  async saveGraphAsImage() {
    const graphElement = this.graphContainer.nativeElement;

    html2canvas(graphElement).then(async (canvas) => {
      const imageData = canvas.toDataURL('image/png');

      const fileNameWithExtension = `${this.fileName}.png`;

      if (this.platform.is('capacitor')) {
        // Mobile (Capacitor)
        await this.saveImageToMobile(imageData, fileNameWithExtension);
      } else {
        // Web
        this.saveImageToWeb(imageData, fileNameWithExtension);
      }
    });
  }

  async saveGraphAsSetting() {
    const formattedBars = this.bars.map(bar => {
      return `${bar.name}{uitgave:${bar.amount},kleur:${bar.color}}`;
    }).join('\n');

    if (this.platform.is('capacitor')) {
      this.saveSettingsToMobile(formattedBars);
    } else {
      this.saveSettingsToWeb(formattedBars);
    }
  }

  async saveSettingsToMobile(data: string){
    try {
      await Filesystem.writeFile({
        path: this.fileName + ".txt",
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
  
      console.log('Bars saved successfully to text file');
      this.modal.dismiss(this.fileName, 'confirm');
    } catch (error) {
      console.error('Error saving bars data to text file', error);
    }
  }

  saveSettingsToWeb(data: string) {
    const blob = new Blob([data], { type: 'text/plain' });
    saveAs(blob, `${this.fileName}.txt`);
    console.log('Settings saved to web');
    this.modal.dismiss(this.fileName, 'confirm');
  }

  async saveImageToMobile(imageData: string, filename: string) {
    try {
      const fileData = imageData.split(',')[1];

      await Filesystem.writeFile({
        path: filename, 
        data: fileData,
        directory: Directory.Documents
      });

      console.log('Image saved successfully');
      this.modal.dismiss(this.fileName, 'confirm');
    } catch (error) {
      console.error('Error saving image', error);
    }
  }

  saveImageToWeb(imageData: string, filename: string) {
    const blob = this.dataURLtoBlob(imageData);
    saveAs(blob, filename);
    console.log('Image saved to web');
    this.modal.dismiss(this.fileName, 'confirm');
  }

  dataURLtoBlob(dataURL: string) {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }
}
