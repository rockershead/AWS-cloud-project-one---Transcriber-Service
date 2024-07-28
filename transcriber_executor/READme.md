## Steps to zip and deploy to lambda

- 1)pip3 install -r requirements.txt --target package
- 2)cd package;zip -r ../deployment.zip .
- 3)cd ..;zip -r deployment.zip ffmpge/
- 4)zip -r deployment.zip index.py
- 5) Zipped file is to be uploaded to s3 bucket
- 6)Deploy lambda with its configurations using terraform(see terraform deployment). Remember to indicate in terraform the s3 url used to store the zipped lambda. 


## Steps to run terraform
- cd terraform_deployment
- terraform init   //only at the start
- terraform fmt
- terraform validate
- terraform apply

//for config file called prod.tfvars
- terraform plan -out -var-file="prod.tfvars"
- terraform apply "-var-file=prod.tfvars"


Architecture:

![transcriber_executor (2)](https://github.com/rockershead/transcriber_service/assets/35405146/81e886db-1557-4120-8a57-978619dc4988)



