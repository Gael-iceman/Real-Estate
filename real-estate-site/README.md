# Real Estate React client 🏘️

## What's this project is about

- [🔥 Deployed Version 🔥](https://desolate-refuge-17574.herokuapp.com/)

Real estate for sale & for rent website. Real estate website's visitors can easily filter their searches by type, location, price, and other predefined and custom criteria. Each property goes with a detailed description, community and property features, location, price, and a great image gallery.

**Disclaimer:**
This project was merely a learning exercise as well as my first sizeable project delving into React, Redux & other used technologies.

## Readme Content

- [Technologies Used](https://github.com/jkarelins/real-estate-site/tree/feat/readme-update#technologies-used)
- [Terms & Conditions](https://github.com/jkarelins/real-estate-site#terms--conditions)
- [Project Goals](https://github.com/jkarelins/real-estate-site#main-goals-of-this-project)
- [Installation & Setup Guide](https://github.com/jkarelins/real-estate-site/tree/feat/readme-update#installation--setup-guide)
- [App Screens](https://github.com/jkarelins/real-estate-site/tree/feat/readme-update#app-screens)
- [Basic Mockups for Project](https://github.com/jkarelins/real-estate-site/tree/feat/readme-update#basic-mockups-for-project)
- [Datastructure for db](https://github.com/jkarelins/real-estate-site/tree/feat/readme-update#datastructure-for-db)

## Technologies Used

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Redux-Thunk](https://github.com/reduxjs/redux-thunk)
- [GitHub](http://github.com)
- [Express](https://expressjs.com/)
- [PostgresQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [react-moment](https://github.com/headzoo/react-moment#readme)
- [Leaflet](https://leafletjs.com/)
- [Cloudinary](https://cloudinary.com/)
- [Cloudinary-React](https://cloudinary.com/documentation/react_integration)

## Terms & Conditions

This project was created in 2 and a half weeks. React Site & API Server was built as Portfolio project, after a Full-Stack Developer cource: [Codaisseur](https://codaisseur.com/).

## Main goals of this project:

- Create Full Stack App independently
  - Using new knowleges from Full Stack course
  - Finding and using new technologies for specific tasks
- Brainstorm idea
- Create Wireframes & Datastructure
- Train Git Usage
  - Work on different branches
  - Create regular PR
  - Write a small summary when you make a PR
  - Create regular commits
  - Make sure latest working version is always on the master branch
- Finish the exististing functionality and polish
- Style Project
- Deploy project

## Installation & Setup Guide

- git clone git@github.com:jkarelins/real-estate-site.git
- cd real-estate-site
- npm install
- npm run start

**_To run on local machine, API server should run on same local machine, using port: 4000_**

- API server link: - [API server](https://github.com/jkarelins/real-estate-server)

## Deployment Guide

**_Before deployment API link should be changed in actions._**

## App Screens

#### User Roles

![User Roles](https://github.com/jkarelins/real-estate-site/blob/master/images/ready-screens/manager-agent-roles.gif?raw=true)

- Manager of Company can activate and suspend accounts of company agents.
- Company Agent can not log in to site, after registration (while manager have not confirmed account)

#### One step to add your property_listing

![One step to add your property_listing](https://github.com/jkarelins/real-estate-site/blob/master/images/ready-screens/Easy-to-add-property.gif)

#### Upload Images to your property_listing

![Upload Images to your property_listing](https://github.com/jkarelins/real-estate-site/blob/master/images/ready-screens/image-upload.gif?raw=true)

#### Add features to your property_listing & Check finished property_listing

![Add features to your property_listing & Check finished property_listing](https://github.com/jkarelins/real-estate-site/blob/master/images/ready-screens/add-features+overview.gif?raw=true)

#### Check Main Page & Search for property_listings

![Check Main Page & Search for property_listings](https://github.com/jkarelins/real-estate-site/blob/master/images/ready-screens/main-page&search.gif?raw=true)

## Basic Mockups for Project

#### Image of Single property_listing page

![Image of Single property_listing page](https://github.com/jkarelins/real-estate-site/blob/master/images/One_property_listing_page.png?raw=true)

#### Image of Search Page

![Image of Search Page](https://github.com/jkarelins/real-estate-site/blob/master/images/Search_page.png?raw=true)

---

# Datastructure for db

#### property_listing

![property_listing data structure](https://github.com/jkarelins/real-estate-site/blob/master/images/property-data-table.png?raw=true)

- isForSale: Boolean,
- isForRent: Boolean,
- realEstateType: TEXT - can select from categories

- adress
- postcode
- city
- price
- Year of construction
- year of last renovation
- Living space
- Number of rooms/bedrooms/bathrooms
- description
- Status: Available/sold
- Energy label
- Heating
- Warm water - Boiler/central
- Location Description
- Garden - optional
- Type of parking

features(especially for rent):
e.g.:
optical internet
free parking
city view/nature view / cannal view
air conditioner
bath

#### User

username: TEXT,
password: TEXT,
email: TEXT,
phoneNumber: Text,

#### User roles

![User Roles](https://github.com/jkarelins/real-estate-site/blob/master/images/user-roles-updated.png?raw=true)

