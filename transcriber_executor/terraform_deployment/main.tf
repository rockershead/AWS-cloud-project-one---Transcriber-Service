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


module "s3" {
  source                    = "./modules/s3"
  lambda_function_arn       = module.lambda.lambda_function_arn
  allow_s3_to_invoke_lambda = module.lambda.allow_s3_to_invoke_lambda
  BUCKET_NAME               = var.BUCKET_NAME
}

module "iam" {
  source          = "./modules/iam"
  main_bucket_arn = module.s3.main_bucket_arn
}

module "lambda" {
  source                     = "./modules/lambda"
  lambda_role_arn            = module.iam.lambda_role_arn
  cloudwatch_policy_iam_role = module.iam.cloudwatch_policy_iam_role
  s3_policy_iam_role         = module.iam.s3_policy_iam_role
  main_bucket_arn            = module.s3.main_bucket_arn
  API_KEY                    = var.API_KEY
  BUCKET_NAME                = var.BUCKET_NAME
  OPENAI_URL                 = var.OPENAI_URL
  TRANSCRIPT_FILE_PATH       = var.TRANSCRIPT_FILE_PATH
  lambda_s3_path             = var.lambda_s3_path
  lambda_s3_bucket           = var.lambda_s3_bucket
}


















