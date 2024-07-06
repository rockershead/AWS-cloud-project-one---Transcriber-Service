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


module "transcriber_executor" {
  source                           = "./transcriber_executor"
  bucket_name                      = var.bucket_name
  sqs_queue_name                   = var.sqs_queue_name
  lambda_timeout_value             = var.lambda_timeout_value
  lambda_s3_bucket                 = var.lambda_s3_bucket
  lambda_s3_path                   = var.lambda_s3_path
  transcriber_executor_lambda_name = var.transcriber_executor_lambda_name
  chatgpt_api_key                  = var.chatgpt_api_key
  openai_url                       = var.openai_url
  transcript_file_path             = var.transcript_file_path

}


