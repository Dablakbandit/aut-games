### **REAMDE**
# PerfectMatch-FullStacl

Note: This repository stores both frontend and backend, since I was the only developer I did that for faster development. The parent directory stores the backend of the app. 

To install FRONTEND, go to frontend folder and see REAMDE

Run npm install:

This app has a few written scripts for ease of use. Run them from the root directory

**npm start**:
    It will run the server.js file.
    Open http://localhost:8000 or http://localhost:5000 to view it in the browser.
    
**"npm run server"**: 
    This will run server.js with the nodemone.
    So, all the changes you make will be updated on the server.
    Open http://localhost:8000 or http://localhost:5000 to view it in the browser.
      
**"npm run client"**: 
	This will run a frontend of the application
    Open http://localhost:3000 to view it in the browser.
    
**"npm run dev"**:  This will run both frontend and backend using nodemon. 
    Open http://localhost:3000 to view frontend in the browser.
    Open http://localhost:8000 or http://localhost:5000 to view backend in the browser.
    
**"npm run data:import"**: 
    This command will import dataset from backend/data/users.js into mongodb and delete and previous records
    Open mongodb collections perfect-match/users to view results.
    
**"npm run data:destroy"**: This command will simply clear the database.
    Open mongodb collections perfect-match/users to view results.
    
**"npm run heroku-postbuild"**: 
This command will deploy the app to heroku


