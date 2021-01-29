# Back end
Go to the back end directory
~~~cd backend~~~

Enter your configs in .env (A default config is already defined)
Run:
  - ~~~yarn~~~ to install the dependencies
  - ~~~yarn sequelize db:create~~~ to create the database
  - ~~~yarn sequelize db:migrate~~~ to run the migrations
  - ~~~yarn dev~~~ to start the development server

## Rotas
To test a route go to backend/requests

**POST /users** Create an user

**POST /sessions** Log in

The next routes need auth

**DELETE /users** Delete an user

**PUT /users** Update an user

**PATCH /users/:id/avatar** Update an user avatar

**GET /users** Filter users




# Front end
  Go to the front end directory
~~~cd web~~~

Run:
  - ~~~yarn~~~ to install the dependencies
  - ~~~yarn dec~~~ to start the develop server

To test the front end
open http://localhost:3000/

register, then login
all the created users will apear in the table.
