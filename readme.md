# 1. Prepare Stable Diffusion
Deforum needs to be installed.

In the Stable Diffusion webui-user.bat, add the following to the COMMANDLINE_ARGS:
```
set COMMANDLINE_ARGS= --api --deforum-api
```

Then you can double click on the bat file and run Stable Diffusion



# 2. Install NodeJS

Download and install NodeJS: 
[nodejs.org](https://nodejs.org/en)

Then install npm:
[https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)



# 3. Download this repo

Clone this repo into a folder on your local computer.



# 4. Install the node_modules for the client
Click on the bat file called install-dependencies.bat



# 5. Adjust the path to the path 
Adjust the path to the path  to which your Stable Diffusion saves your files.

In the server folder is a file called config.js
```
export const basePath = 'E:/output/sd-api';
```

Put your Stable Diffusion output folder path here



# 5. Run the client and the server

Click on the run-client-and-server.bat


# 6. More info

To restart the client or the sever, you need to either close ther terminals and the run the run-client-and-server.bat.

Or you go into a terminal and press "Control C" to stop the programm.

To run it again, just write
```
npm run start
```

in the severfile config.js are the setting for stable diffusion if you want to change them