## Steps to zip and deploy to lambda

- 1)pip3 install -r requirements.txt --target package
- 2)cd package;zip -r ../deployment.zip .
- 3)cd ..;zip -r deployment.zip ffmpge/
- 4)zip -r deployment.zip index.py
- 5)zip -r deployment.zip xxxx.mp3 (if need to test with inbuilt mp3 file)
- 6)Deploy to lambda;make sure lambda python environment used is python 3.10
- 7)Make sure timeout is set to 5mins;set memory to 3008MB;Give s3 permissions to lambda function
- 8)Set the necessary environment variables within the lambda function on the aws dashboard


Architecture:

![transcriber_executor (1)](https://github.com/rockershead/transcriber_service/assets/35405146/493ae237-74cd-48a8-af5c-ab4e73256902)


