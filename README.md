# The Other NinetyNine

---

_This is a group project made in Node.js accompanied by Express and Mongoose as the main web application frameworks. Clients get to donate money to different charity organizations. Clients are able to create an account and add items to a wishlist as well as edit or delete added items in their cart. There is also the possibility to create an admin account, where the admin can edit, delete and add new projects to the website. All content is saved on MongoDB._

## Installation:

Create a new folder

1. Navigate to the directory where you want to put your repository,
2. Run `git clone https://github.com/edvinsjogren/WEBSHOP-FED20S-GROUP-6.git`
3. Run `npm install` to install node modules

## Naming conventions
_Below you'll find a brief summary of the naming conventions for this project_

### Variables

- Use let or const instead of var
- When naming variables use **camelCase**
  - Eg. "let userName = "User";\*
- When naming Mongoose schemas use **PascalCase**
  - Eg. ` const User = mongoose.model("user", userSchema)´_

###  CSS/SCSS namning conventions

- When naming variables use **kebab-case**
  - Eg. \$bg-color: grey;\*
- When naming classes and id:s use **camelCase**

### Functions

  - When writing functions write `function functionName(){}´
  - Function names should be in **camelCase**


## Project structure

- ProjectFolder/ index.js, Models, Views, Controllers, Middleware, Public, Routes, SCSS and Config are placed here_
  - index.js is placed directly under the root directory 
  - _Models/ \the Mongoose schemas are placed in here 
  - _Views/ \ejs-files are placed in here
  - _Controller/ \controller.js-files are placed here
  - _Middleware/ \essential middlewares are placed here
  - _Public/ \styles folder with css-files and other files that are related to styling are placed in here
  - _Routes/ \the routes to the database are placed in here
  - _SCSS/ \ all scss-files are placed here
  - _Config/ \config.js is placed here with important keys. Make sure to replace these with your own keys and don't forget to add your .env-file as well.
 
  
