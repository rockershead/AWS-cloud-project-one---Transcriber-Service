terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1"
}


module "transcriber_api" {
  source               = "./transcriber_api"
  vpc_name             = var.vpc_name
  cidr_block           = var.cidr_block
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  azs                  = var.azs
  ingress_cidr         = var.ingress_cidr
  egress_cidr          = var.egress_cidr
  ssm_parameter_values = var.ssm_parameter_values
  parameter_store_keys = var.parameter_store_keys
  ecs_service_name     = var.ecs_service_name
  ecr_repo_url         = var.ecr_repo_url
  container_port       = var.container_port

}




