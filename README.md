# Capstone 490
CS/INFX 490: Capstone Project

## Overview  
**Capstone** is a web-based platform designed to assist web sleuths in identifying potential leads between missing persons and unidentified bodies. By aggregating data from multiple sources, the system allows users to compare cases side-by-side, filter information, and uncover possible matches.  

## Features  
- Search and filter **missing persons** and **unidentified persons** databases  
- Side-by-side comparison of cases to find potential matches  
- User accounts to **save potential matches**  
- Case request submission for missing/unidentified persons not listed  
- Web scraping integration for automated data collection  
- AI-assisted matching (future implementation) 



## Setup & Installation  

### **1. Clone the Repository**  
```sh
git clone https://github.com/AlexanderMoline/Capstone490.git

cd Capstone490
```
### **2. Install Dependencies**
```npm
npm install
```
### **3. Run Server**
```npm
npm run dev
```
## Contributing Guide  

### 1. Prerequisites  
1. Install **Git**: [Download Git](https://git-scm.com/downloads)  
2. Install **Node.js** (for backend & frontend): [Download Node.js](https://nodejs.org/)  
3. Create a **GitHub Account** if you don’t have one: [Sign up here](https://github.com/)  

### 2. Create a New Branch
```sh
git checkout -b feature-name
```
### 3. Stage & Commit
```sh
git add .
```
Then, commit with a meaningful message:
```sh
git commit -m "feat: added user authentication"
```
### 4. Push Branch to GitHub
```sh
git push origin feature-name
```
### 5. Create a Pull Request (PR)
1. Go to the **GitHub** repository: https://github.com/AlexanderMoline/Capstone490 
2. Click **"Compare & pull request"**
3. Add a **Title & Description** explaining the change
Click "Create Pull Request"
4. Click **"Create Pull Request"**

### 6. Docker set up
1. After pulling, make sure you have docker desktop installed: https://docs.docker.com/compose/install/
2. Navigate to \backend and run the following command: **docker-compose up --build**
3. Verify the database using the following command: **docker exec -it backend-db-1 psql -U postgres -d camup** Use **\dt** to view a list tables
4. If the db was not initialized attempt manual restoration with the following command: **docker exec -it backend-db-1 pg_restore -U postgres -d camup ./backend/backup.tar**


A team lead will **Review and Merge** the changes into the **main branch**.
   
## Authors  
- [Alexander](https://github.com/AlexanderMoline)  
- [Jane](https://github.com/github-username)
- [Maloni](https://github.com/github-username)
- [Logan](https://github.com/github-username)
- [Abby](https://github.com/github-username)