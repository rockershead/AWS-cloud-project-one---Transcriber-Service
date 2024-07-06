
variable "transcriber_executor_lambda_name" {
  description = "Name of lambda function"
  type        = string

}

variable "bucket_name" {
  description = "Value of the bucket"
  type        = string

}

variable "sqs_queue_name" {
  description = "Name of SQS queue"
  type        = string

}

variable "lambda_timeout_value" {
  description = "Lambda Timeout Value"
  type        = number

}

variable "lambda_s3_bucket" {
  description = "Value of the lambda_s3_bucket"
  type        = string

}


variable "lambda_s3_path" {
  description = "Value of the lambda_s3_path"
  type        = string

}


variable "chatgpt_api_key" {
  description = "chatgpt_api_key"
  type        = string

}



variable "openai_url" {
  description = "openai url"
  type        = string

}

variable "transcript_file_path" {
  description = "transcript file path"
  type        = string

}







