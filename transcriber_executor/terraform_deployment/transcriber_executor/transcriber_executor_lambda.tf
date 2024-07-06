resource "aws_lambda_function" "terraform_transcriber_executor" {
  s3_bucket     = var.lambda_s3_bucket
  s3_key        = var.lambda_s3_path
  function_name = var.transcriber_executor_lambda_name
  role          = aws_iam_role.transcriber_executor_lambda_role.arn
  handler       = "index.main"
  runtime       = "python3.10"
  memory_size   = 3008
  timeout       = var.lambda_timeout_value
  environment {
    variables = {
      API_KEY              = var.chatgpt_api_key
      BUCKET_NAME          = var.bucket_name
      OPENAI_URL           = var.openai_url
      TRANSCRIPT_FILE_PATH = var.transcript_file_path

    }
  }
  depends_on = [aws_iam_role.transcriber_executor_lambda_role]
}




resource "aws_iam_role" "transcriber_executor_lambda_role" {
  name               = "${var.transcriber_executor_lambda_name}_role"
  description        = "Lambda execution role for ${var.transcriber_executor_lambda_name}"
  assume_role_policy = data.aws_iam_policy_document.assume_transcriber_executor_lambda_role.json

  inline_policy {
    name   = "transcriber_executor_lambda_role_policy"
    policy = data.aws_iam_policy_document.transcriber_executor_lambda_role_permissions.json
  }
}


data "aws_iam_policy_document" "assume_transcriber_executor_lambda_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}


data "aws_iam_policy_document" "transcriber_executor_lambda_role_permissions" {

  #Cloudwatch Logs permission required for Lambda
  statement {
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = [
      "arn:aws:logs:ap-southeast-1:${data.aws_caller_identity.current_caller_for_transcriber_executor_lambda.account_id}:*"
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "logs:CreateLogStream"
    ]
    resources = [
      "arn:aws:logs:ap-southeast-1:${data.aws_caller_identity.current_caller_for_transcriber_executor_lambda.account_id}:log-group:/aws/lambda/${var.transcriber_executor_lambda_name}:*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:ap-southeast-1:${data.aws_caller_identity.current_caller_for_transcriber_executor_lambda.account_id}:log-group:/aws/lambda/${var.transcriber_executor_lambda_name}:log-stream:*"
    ]
    effect = "Allow"
  }


  ##sqs permission

  statement {
    actions = [
      "sqs:DeleteMessage",
      "sqs:ReceiveMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [
      aws_sqs_queue.transcriber_sqs_queue.arn
    ]
    effect = "Allow"
  }

  ##s3 permissions

  # S3 permissions for the bucket named "vv"
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket"
    ]
    resources = [
      "arn:aws:s3:::${var.bucket_name}",
      "arn:aws:s3:::${var.bucket_name}/*"
    ]
    effect = "Allow"
  }

}


###sqs trigger lambda
resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  event_source_arn = aws_sqs_queue.transcriber_sqs_queue.arn
  function_name    = var.transcriber_executor_lambda_name
  batch_size       = 1

  scaling_config {
    maximum_concurrency = 1000
  }

  depends_on = [
    aws_lambda_function.terraform_transcriber_executor
  ]
}
