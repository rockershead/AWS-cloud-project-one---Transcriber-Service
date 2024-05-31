resource "aws_lambda_function" "terraform_transcriber_executor" {
  s3_bucket     = var.lambda_s3_bucket
  s3_key        = var.lambda_s3_path
  function_name = "terraform_transcriber_executor"
  role          = var.lambda_role_arn
  handler       = "index.main"
  runtime       = "python3.10"
  memory_size   = 3008
  timeout       = 900
  environment {
    variables = {
      API_KEY              = var.API_KEY
      BUCKET_NAME          = var.BUCKET_NAME
      OPENAI_URL           = var.OPENAI_URL
      TRANSCRIPT_FILE_PATH = var.TRANSCRIPT_FILE_PATH

    }
  }
  depends_on = [var.cloudwatch_policy_iam_role, var.s3_policy_iam_role]
}



# Add a bucket notification to trigger the Lambda function on object creation in the "voice_files" folder



# Allow S3 to invoke the Lambda function
resource "aws_lambda_permission" "allow_s3_to_invoke_lambda" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terraform_transcriber_executor.function_name
  principal     = "s3.amazonaws.com"

  # Use the bucket's ARN as the source ARN
  source_arn = var.main_bucket_arn
}
