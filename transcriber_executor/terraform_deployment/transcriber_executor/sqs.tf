resource "aws_sqs_queue" "transcriber_sqs_queue" {
  name          = var.sqs_queue_name
  delay_seconds = 0
  # Recommended to be 6 times of lambda timeout
  visibility_timeout_seconds = 6 * var.lambda_timeout_value
  max_message_size           = 262144
  message_retention_seconds  = 1209600
  # Introduces latency in exchange for cost saving
  receive_wait_time_seconds = 2
  sqs_managed_sse_enabled   = true
}


data "aws_iam_policy_document" "transcriber_sqs_queue_permissions" {
  statement {
    sid       = "__owner_statement"
    effect    = "Allow"
    actions   = ["SQS:*"]
    resources = [aws_sqs_queue.transcriber_sqs_queue.arn]
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current_caller_for_transcriber_executor_lambda.account_id}:root"]
    }
  }
  ##allow s3 sendmessage
  statement {
    sid       = "AllowS3SendMessage"
    effect    = "Allow"
    actions   = ["SQS:SendMessage"]
    resources = [aws_sqs_queue.transcriber_sqs_queue.arn]
    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }
    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"
      values   = ["arn:aws:s3:::${var.bucket_name}"]
    }
  }

  ###allow lambda role to read from sqs
  statement {
    sid    = "AllowLambdaPoll"
    effect = "Allow"
    actions = [
      "SQS:ReceiveMessage",
      "SQS:DeleteMessage",
      "SQS:GetQueueAttributes"
    ]
    resources = [aws_sqs_queue.transcriber_sqs_queue.arn]
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.transcriber_executor_lambda_role.arn]
    }

  }

  depends_on = [
    aws_sqs_queue.transcriber_sqs_queue,
    aws_lambda_function.terraform_transcriber_executor,

  ]

}


resource "aws_sqs_queue_policy" "s3_event_queue_policy" {
  queue_url = aws_sqs_queue.transcriber_sqs_queue.id
  policy    = data.aws_iam_policy_document.transcriber_sqs_queue_permissions.json
}


