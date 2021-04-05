# The Other NinetyNine

---

_This is a group project made in Node.js accompanied by Express and Mongoose as the main web application frameworks. Clients get to donate money to different charity organizations. Clients are able to create an account and add items to a wishlist as well as edit or delete added items in their cart. There is also the possibility to create an admin account, where the admin can edit, delete and add new projects to the website. All content is saved on MongoDB._

## Installation:

Create a new folder

1. Navigate to the directory where you want to put your repository,
2. Run `git clone https://github.com/edvinsjogren/WEBSHOP-FED20S-GROUP-6.git`
3. Run `npm install` to install node modules

## Naming conventions

- Below you'll find a brief summary of the naming conventions for this project\*

### Variables

- Use let or const instead of var
- When naming variables use **camelCase**
  - Eg. "let userName = "User";\*
- When naming Mongoose schemas use **PascalCase**
  _Eg. `const PI = 3.14;´_

### Variables in CSS/SCSS

- When naming variables **camelCase**
  - Eg. \$bg-color: grey;\*

### Functions

- **Don't** use arrow functions.
  _When writing functions write `function functionName(){}´_
- Function names should be in **camelCase**

### Classes

- Class names should be in **PascalCase**
  \*Eg. ClassTask

## Project structure

- ProjectFolder/ index.js, Models, Views, Controllers, Middleware, Public, Routes, SCSS and Config are placed here_
  - index.js is placed directly under the root directory 
  - _Models/ \_the Mongoose schemas are placed in here_
  - _Views/ \_ejs-files are placed in here_
  - _Controller/ \_controller.js-files are placed here_
  - _Middleware/ \essential middlewares are placed here_
  - _Public/ \_styles folder with css-files and other files that are related to styling are placed in here_
  - _Routes/ \_the routes to the databas are placed in here_
  - _SCSS/ \_main.scss is placed here_
  - _Config/ \_config.js is placed here with important keys,´. Make sure to replace these with your own keys and don't forget to add your .env-file as well._
 
  
