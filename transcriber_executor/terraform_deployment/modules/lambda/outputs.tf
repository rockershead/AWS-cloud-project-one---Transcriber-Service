output "lambda_function_arn" {
  value = aws_lambda_function.terraform_transcriber_executor.arn

}

output "allow_s3_to_invoke_lambda" {

  value = aws_lambda_permission.allow_s3_to_invoke_lambda

}
