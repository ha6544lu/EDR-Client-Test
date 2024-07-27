import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDRComponentComponent } from './edrcomponent.component';
import { EDRClientService } from '../../services/edrclient.service';

describe('EDRComponentComponent', () => {
  let component: EDRComponentComponent;
  let fixture: ComponentFixture<EDRComponentComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDRComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EDRComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
