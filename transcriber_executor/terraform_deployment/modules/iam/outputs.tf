output "lambda_role_arn" {
  value = aws_iam_role.lambda_role.arn

}

output "cloudwatch_policy_iam_role" {

  value = aws_iam_role_policy_attachment.attach_cloudwatch_policy_to_iam_role
}

output "s3_policy_iam_role" {

  value = aws_iam_role_policy_attachment.attach_s3_policy_to_iam_role
}
