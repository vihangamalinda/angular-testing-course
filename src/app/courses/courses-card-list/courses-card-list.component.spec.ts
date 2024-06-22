import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
    // compileCompomnent  Return the compilation of component through promise
    // we need to handle it
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    // Identifying thg component is empty and data will be added after change detection
    // console.log("Before change detection",el.nativeElement.outerHTML);
    fixture.detectChanges();
    // console.log("After change detection",el.nativeElement.outerHTML);

    const courses = el.queryAll(By.css(".course-card"));
    expect(courses).toBeTruthy();
    expect(courses.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();
    const course = component.courses[0];

    const card = el.queryAll(By.css(".course-card:first-child"))[0],
      title = card.query(By.css("mat-card-title")),
      image = card.query(By.css("img"));
    expect(card).toBeTruthy("Could not find the course");
    expect(title.nativeElement.textContent).toEqual(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});
