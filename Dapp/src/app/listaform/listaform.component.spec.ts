import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaformComponent } from './listaform.component';

describe('ListaformComponent', () => {
  let component: ListaformComponent;
  let fixture: ComponentFixture<ListaformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
