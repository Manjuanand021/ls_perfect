import { Component, Input } from '@angular/core';

@Component({
	template: ''
})

export class StepProgressBar {

	public static inputs: string[] = ['step'];
	@Input() step: any;

}

/*
https://github.com/angular/angular/issues/5415

class BaseComponent {
  // Decorators are not currently inherited but are left in to put the compiler at ease
  @ViewChild(SomeComponent) comp;
  @Input() someInput;
  @Output() someOutput = new EventEmitter();

  // To be added to the child component's Component metadata
  static metaData = {
    queries: {
      comp: new ViewChild(SomeComponent)
    },
    inputs: ['someInput'],
    outputs: ['someOutput']
  };
}

@Component(Object.assign({
  selector: 'my-component',
  templateUrl: 'my-component.html
}, BaseComponent.metaData))
class MyComponent extends BaseComponent {
  constructor() {
    super();
  }
}
*/
