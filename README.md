# Webshop with Node.js

---

_This is a group project with Node.js where clients get to donate money to different charity organizations. Clients are able to create an account and add items to a wishlist as well as edit added items to cart. All content is saved on MongoDB_

## Installation:

Create a new folder

1. Navigate to the directory where you want to put your repository,
2. Run git clone `https://github.com/edvinsjogren/WEBSHOP-FED20S-GROUP-6.git´
3. Run npm install to install node modules

## Naming conventions

- Below you'll find a brief summary of the conventions for this project\*

### Variables

- Use let or const instead of var
- When naming variables use **camelCase**
  - Eg. "let userName = "User";\*
- When naming global variables use **UPPERCASE**
  _Eg. `const PI = 3.14;´_

### Variables in CSS

- When naming variables **camelCase**
  - Eg. \$bg-color: grey;\*

### Functions

- **Don't** use arrow functions.
  _When writing functions write `function functionName(){}´_
- Function names should be in **camelCase**

### Classes

- Class names should use **PascalCase**
  \*Eg. ClassTask

## Project structure

- ProjectFolder/ _schema models, views, public and js-files are placed here_
  - _Models/ \_the schemas are placed in here_
  - _Public/ \_styles folder with css-files and other files that are related to styling are placed in here_
  - _Routes/ \_the routes to the databas are placed in here_
  - _Views/ \_ejs-files are placed in here_
  - _SCSS/ \_main.scss is placed here_
  - _Config/ \_config.js is placed here with important keys,´. Make sure to replace these with your own keys._
  - _Controller/ \_main.scss is placed here_
