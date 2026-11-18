import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('EduPass Campus App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the EduPass Campus studio app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render seeded MSAJCE student card and roster immediately on first load', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('EduPass Campus');
    expect(compiled.textContent).toContain(
      'Mohamed Sathak A.J. College of Engineering',
    );
    expect(compiled.textContent).toContain('Aanya Sharma');
    expect(compiled.textContent).toContain('311824104089');
    expect(compiled.textContent).toContain('Rohan Menon');
    expect(compiled.querySelectorAll('svg.qr-svg').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('svg.barcode-svg').length).toBeGreaterThan(0);
  });

  it('should flip between Front and Back faces and switch selected student', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(app.isFlipped()).toBe(false);
    app.toggleFlip();
    fixture.detectChanges();
    expect(app.isFlipped()).toBe(true);

    app.selectStudent('stu_102');
    fixture.detectChanges();
    expect(app.store.draftCard().fullName).toBe('Rohan Menon');
    expect(app.store.draftCard().theme).toBe('emerald');
  });
});
