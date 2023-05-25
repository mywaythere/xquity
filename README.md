# Introduction

This project is try to build an interactive platform for equality, potentially help the digital natives achieve greater awareness of their own unconscious bias. Thus, this would contribute to build a more inclusive and diverse workplace.

This is an individual project guided by a mentor and buddy from the Software Development Team from Credit Suisse. The theme for the project is Embrace Equity, ‘Cracking the Code: Innovation for a gender equal future’.

To embrace equity, it is important to first be aware of unconscious biases, which are unconscious assumptions, beliefs, or attitudes that can influence our thoughts and actions. Unconscious biases can affect our professional interactions and decision-making and can negatively impact a company's culture and team dynamics if not addressed.

Examples listed as follows:

- Gender bias
- Ageism bias
- Lookism/Beauty bias
- Halo effect
- Horns effect
- Confirmation bias

For users, they can uncover and be more aware of the different types of unconscious bias they may have, reflect on their experiences and apply what they have learned in the platform.
Basic features for them: (with example cases)

- New user sign-up✅ & build their profiles(age;environment;gender;etc) on the platform
- Interactive features to choose different personas/circumstances to understand their potential unconscious biases:
  1. Reviewing Resumes
  2. Decisions about promotions
  3. Colleagues feedback
- Forum and followup chats for respectful and constructive conversations: ✅
  1. share experience ✅
  2. ask questions ✅
  3. give feedback(comments) to each other✅
- Based on user profiles, generate customized toolkits:
  1. Information for possible different bias
  2. Strategies to recognize and minimize the bias
  3. Possible practices with similar cases
- Based on machine learning to recommend further reading materials
<!-- Needs further consideration for data collection, cleaning, analysing and sentiment analysis so on. (involving ML and NLP)-->

# Guide for Developers

## Tech Stacks

- Front-end: React
- Back-end: Node.js with Express (TypeScript including sockets)
- Database: MongoDB (NoSQL)
- Cloud: AWS and Google Cloud

## Initial setup

To code in this application, we need:

- A bash console (Terminal on Mac or Linux; Git Bash recommended On Windows)
- NodeJS version 18. If it is installed correctly, typing "node --version" should give v18.13.0 and "npm --version" should give 8.19.3 or above
- Visual Studio Code (or another code editor)
- the Prettier VSCode extension
- MongoDB Atlas for Database
- For Authentication, we use google service

## Downloading these files

navigate GitHub repository as usual:

- git add -A
- git commit -m "Skeleton code"
- git push

## Private settings for the application

- the Frontend CLIENT_ID (Skeleton.js, auth.js)
- the Database SRV (mongoConnectionURL) for Atlas (server.js).

## How to run this application

First, 'npm install'
Then open two seperate terminals, and 'npm run hotloader' in the first, and 'npm start' in the second.
Then open http://localhost:5050

## Test Cases

<!-- Needs further consideration about Test Driven Developement-->

## Thanks for reading :)
