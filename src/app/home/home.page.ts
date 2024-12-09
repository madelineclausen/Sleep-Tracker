import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { DatePipe } from '@angular/common';
import { Camera, CameraResultType } from '@capacitor/camera';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	sleepDate:Date = new Date();
	wakeDate:Date = new Date();
	sleep_service:SleepService;
	overnight_data:OvernightSleepData = new OvernightSleepData(this.sleepDate, this.wakeDate);
	sleepiness:StanfordSleepinessData = new StanfordSleepinessData(0);
	openWake:Boolean = false;
	openSleepiness:Boolean = false;
	openCamera:Boolean = false;
	openResults:Boolean = false;
	displayResults:Boolean = false;
	progress:number = 0;
	maxDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-ddTHH:mm');
	capturedImage:any;
  	constructor(public sleepService:SleepService) {
		this.sleep_service = sleepService;

	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	onSleepSelected(event: CustomEvent) {
		this.sleepDate = new Date(event.detail.value);
		this.openWake = true;
	  }

	onWakeSelected(event: CustomEvent) {
		this.wakeDate = new Date(event.detail.value);
		this.openSleepiness = true;
	}

	onSleepinessSelected(event: CustomEvent) {
		this.sleepiness = new StanfordSleepinessData(event.detail.value);
		this.openCamera = true;
	}

	getProgress() {
		this.progress = (this.wakeDate.getTime() - this.sleepDate.getTime()) / 3600000;		
	}

	getCardContent()
	{
		return this.sleepiness.summaryString();
	}

	takePicture = async () => {
		const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: false,
		resultType: CameraResultType.Uri,
		});
		this.capturedImage = image.webPath;
		this.openResults = true;
	}

	showResults() {
		this.overnight_data = new OvernightSleepData(this.sleepDate, this.wakeDate);
		this.sleep_service.logOvernightData(this.overnight_data);
		this.sleep_service.logSleepinessData(this.sleepiness)
		console.log(this.overnight_data);
		console.log(this.sleepiness);
		this.getProgress();
		this.displayResults = true;

	}

}
