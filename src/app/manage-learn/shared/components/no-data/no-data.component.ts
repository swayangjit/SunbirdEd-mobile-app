import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  @Input() message = 'NO_DATA_FOUND';
  @Input() color = 'text-black';
  constructor() { }


}
