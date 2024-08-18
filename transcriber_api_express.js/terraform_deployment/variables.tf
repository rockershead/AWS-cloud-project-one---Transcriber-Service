variable "cidr_block" {
  type        = string
  description = "cidr block"
  default     = "12.0.0.0/16"

}

variable "vpc_name" {

  type        = string
  description = "vpc name"
  default     = "transcriber_api_vpc"

}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"
  default     = ["12.0.1.0/24", "12.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"
  default     = ["12.0.3.0/24", "12.0.4.0/24"]
}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

variable "ingress_cidr" {
  type        = list(string)
  description = "Ingress cidr"
  default     = ["0.0.0.0/0"]
}

variable "egress_cidr" {
  type        = list(string)
  description = "egress cidr"
  default     = ["0.0.0.0/0"]
}


variable "parameter_store_keys" {
  type        = list(string)
  description = "param keys"
  default     = ["value"]
}

variable "ssm_parameter_values" {
  type        = list(string)
  description = "param values"
  default     = ["value"]
}


variable "ecs_service_name" {
  type        = string
  description = "ecs service name"
  default     = "transcriber-api-service-v2"

}

variable "ecr_repo_url" {
  type        = string
  description = "Url of ecr repo"
  default     = ""
}

variable "container_port" {
  type        = number
  description = "container port indicated in Dockerfile"
  default     = 8087

}

variable "domain_name" {
  type        = string
  description = "domain name of site"
  default     = "transciberz.org"

}
