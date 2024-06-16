import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CoursesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrive all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "Incorrect number of courses");
    });
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should retrive a course for the given id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("No course returened");
      expect(course.id).toBe(12, "Incorrect course Id");
    });
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("should retrive the lessons on accesnding order", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toEqual(3);
      console.log(lessons);
    });
    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");
    // Slicing the arrray due to pagingation is 3
    req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
  });

  it("should update the course", () => {
    const changes: Partial<Course> = { titles: { description: "Vihanga" } };
    coursesService.saveCourse(5, changes).subscribe((course) => {
      expect(course).toBeTruthy("No course retruned");
    });

    const req = httpTestingController.expectOne(`/api/courses/5`);
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    req.flush({ ...COURSES[12], ...changes });
  });

  it("should fail the updating course", () => {
    const changes: Partial<Course> = { titles: { description: "Vihanga" } };
    coursesService.saveCourse(5, changes).subscribe(
      () => fail("This will fail save course operation"),
      (err: HttpErrorResponse) => expect(err.status).toEqual(500)
    );

    const req = httpTestingController.expectOne("/api/courses/5");
    expect(req.request.method).toEqual("PUT");
    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
