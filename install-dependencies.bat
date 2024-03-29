@echo off
echo Installing dependencies for the client and server...

cd client
npm install
cd..

cd server
npm install
cd..

echo Dependencies have been installed.
pause
