## Steps to deploy terraform
- terraform init   //only at the start
- terraform fmt
- terraform validate
- terraform apply

//for config file called prod.tfvars
- terraform plan -out -var-file="prod.tfvars"
- terraform apply "-var-file=prod.tfvars"
