const authorize = require('./gauth.js');
const { google } = require("googleapis");
let teks = "";

async function listCourses(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  const res = await classroom.courses.list({
    pageSize: 100,
  });
  const courses = res.data.courses;
  if (!courses || courses.length === 0) {
    console.log("No courses found.");
    return;
  }

  for (const course of courses) {
    teks += `[${course.name} (${course.id})]\n`;
    await listCourseWork(classroom, course.id);
    teks += "\n"; // Add a newline for separation between courses
  }
}

async function listCourseWork(classroom, courseId) {
  try {
    const res = await classroom.courses.courseWork.list({
      courseId: courseId,
      pageSize: 100,
    });
    console.log("API Response: ✔"); // Tambahkan log untuk memeriksa data
    const courseWork = res.data.courseWork;

    if (!courseWork) {
      teks += `--> tidak ada tugas\n`;
    } else if (courseWork.length === 0) {
      teks += `--> tidak ada tugas\n`;
    } else {
      courseWork.forEach((work) => {
        teks += `--> ${work.title}\n`;
      });
    }
  } catch (error) {
    console.error(
      `Error fetching coursework for course ID ${courseId}:`,
      error
    );
  }
}

async function main() {
  try {
    const client = await authorize();
    await listCourses(client);
    return teks;
  } catch (error) {
    console.error(error);
  }
}

module.exports = main; // Export the main function
