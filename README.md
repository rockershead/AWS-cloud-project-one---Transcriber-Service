# transcriber_service

The transriber executor will be executed when the client api upload a voice file onto s3 bucket.The transcriber executor will then process the file and output the transcript text file onto s3 which can be viewed using the client api. A more detailed architecture diagram will be shown in each of the folders. I am aiming to deploy the API using 3 differnt methods: 
1) AWS ecs using copilot
2) AWS  ecs using terraform
3) Kubrnetes manual deployment
4) kuernetes deployment using terraform
