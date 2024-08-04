# transcriber_service

The transriber executor will be executed when the client api uploads a voice file onto a s3 bucket. This event will be uploaded to a sqs queue.The transcriber executor lambda function will then be triggered by the sqs queue to process the file and output the transcript text file onto s3 which can be viewed using the client api. A more detailed architecture diagram will be shown in each of the folders. I am aiming to deploy the API using 3 different methods: 
1) AWS ecs using copilot
2) AWS ecs using terraform
3) Kubrnetes manual deployment

