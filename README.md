# transcriber_service
This is the first project of my cloud project series to practise my AWS cloud skills.
The 2 main services to focus on are the transcriber_executor and transcriber_api_express.js folders which make up the core of the backend portion.CMS is only for frontend.Please IGNORE the transcriber_api_wriiten_in_lambda folder. 

The transriber executor will be executed when the client api(transcriber_api_express.js) uploads a voice file onto a s3 bucket. This event will be uploaded to a sqs queue.The transcriber executor lambda function will then be triggered by the sqs queue to process the file and output the transcript text file which will be stored in s3 to be viewed using the client api.

The transcriber executor has been deployed using terraform.

I have tried deploying the transcriber_api_express.js using 3 different methods: 
1) AWS ecs using copilot
2) AWS ecs using terraform
3) Kubernetes

