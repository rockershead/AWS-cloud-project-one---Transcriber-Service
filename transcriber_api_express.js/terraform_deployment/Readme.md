## Steps to deploy terraform
- terraform init   //only at the start
- terraform fmt
- terraform validate
- terraform apply

//for config file called prod.tfvars
- terraform plan -out -var-file="prod.tfvars"
- terraform apply "-var-file=prod.tfvars"


##Using ACM 
After creating your ssl certs in aws,click the certificate id and go to domains and click "create records in route 53" to add to the zone domains
