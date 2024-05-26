variable "lambda_s3_bucket" {
  description = "Value of the lambda_s3_bucket"
  type        = string
  default     = "transcriber-lambda-api"
}


variable "lambda_s3_path" {
  description = "Value of the lambda_s3_path"
  type        = string
  default     = "new_image_python3.10/deployment-ver4.zip"
}



variable "API_KEY" {
  description = "api key"
  type        = string
  default     = ""
}

variable "BUCKET_NAME" {
  description = "Value of the bucket"
  type        = string
  default     = ""
}

variable "OPENAI_URL" {
  description = "openai url"
  type        = string
  default     = "https://api.openai.com/v1/audio/transcriptions"
}

variable "TRANSCRIPT_FILE_PATH" {
  description = "transcript file path"
  type        = string
  default     = ""
}


