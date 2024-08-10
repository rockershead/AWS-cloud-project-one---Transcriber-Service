variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"

}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"

}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"

}

variable "cidr_block" {
  type        = string
  description = "cidr block"


}

variable "vpc_name" {

  type        = string
  description = "vpc name"


}

variable "ingress_cidr" {
  type        = list(string)
  description = "Ingress cidr"

}

variable "egress_cidr" {
  type        = list(string)
  description = "egress cidr"

}

variable "parameter_store_keys" {
  type = list(string)
}

variable "ssm_parameter_values" {
  type = list(string)
}


variable "ecs_service_name" {
  type        = string
  description = "ecs service name"


}


variable "ecr_repo_url" {
  type        = string
  description = "Url of ecr repo"

}

variable "container_port" {
  type        = number
  description = "container port indicated in Dockerfile"


}

variable "domain_name" {
  type        = string
  description = "domain name of site"


}
