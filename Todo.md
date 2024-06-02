# CODL - *a Python education platform*

## User Stories
---
#### Teacher
- A teacher should be able to create coding challenges.
- A teacher should be able to create test cases for those challenges.
- A teacher should be able to create multiple choice quizzes.
- A teacher editing a lesson *(i.e. a markdown)* should have the option for bold etc, save,
- A teacher should be able to make a shortened url to prompt a new student to join the class
- A teacher must be able to see history of a specific student's challenge
- A teacher should be able to see which users are currently doing the code.
- A teacher should be able to live code with a student (i.e. Multiplayer mode)

#### Student
- A student joining a class should have the option to create an account or join class anonymously
- A student should be able to run code for a problem and see if they passed all the test cases or not.


# Development Notes:
-  Running `npx prisma migrate dev --name <migration name>` updates DB based on prisma.schema
-  Running `npx prisma db pull` updates schema.prisma based on DB
- Database design: https://dbdiagram.io/d/codl-664bec0df84ecd1d22b0b0d4 
- Project management: https://github.com/users/rtutz/projects/2/views/1 
