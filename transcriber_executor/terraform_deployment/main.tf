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

resource "aws_s3_bucket" "main_bucket" {
  bucket = var.BUCKET_NAME
}

# Create the first folder in the S3 bucket
resource "aws_s3_object" "object1" {
  bucket = aws_s3_bucket.main_bucket.bucket
  key    = "voice_files/"
}

# Create the second folder in the S3 bucket
resource "aws_s3_object" "object2" {
  bucket = aws_s3_bucket.main_bucket.bucket
  key    = "transcripts/"
}


resource "aws_iam_role" "lambda_role" {
  name = "terraform_transcriber_executor_role"

  assume_role_policy = <<EOF

{"Version": "2012-10-17",
 "Statement": [

   {

     "Action": "sts:AssumeRole",

     "Principal": {

       "Service": "lambda.amazonaws.com"

     },

     "Effect": "Allow",

     "Sid": ""

   }

 ]

}

EOF

}

resource "aws_iam_policy" "cloudwatch" {
  name        = "aws_iam_policy_for_cloudwatch"
  path        = "/"
  description = "AWS IAM Policy for cloudwatch"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:ap-southeast-1:997329144140:*"
      
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:logs:ap-southeast-1:997329144140:log-group:/aws/lambda/terraform_transcriber_executor:*"
      ]
    }
  ]
}
EOF
}



resource "aws_iam_policy" "s3" {



  name = "aws_iam_policy_for_s3"

  path = "/"

  description = "aws_iam_policy_for_s3"

  policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": "s3:*",
			"Resource": [
				"${aws_s3_bucket.main_bucket.arn}",
                "${aws_s3_bucket.main_bucket.arn}/*"
			]
		}
	]
}
EOF

}



resource "aws_iam_role_policy_attachment" "attach_cloudwatch_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.cloudwatch.arn
}

resource "aws_iam_role_policy_attachment" "attach_s3_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.s3.arn
}



resource "aws_lambda_function" "terraform_transcriber_executor" {
  s3_bucket     = var.lambda_s3_bucket
  s3_key        = var.lambda_s3_path
  function_name = "terraform_transcriber_executor"
  role          = aws_iam_role.lambda_role.arn
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
  depends_on = [aws_iam_role_policy_attachment.attach_cloudwatch_policy_to_iam_role, aws_iam_role_policy_attachment.attach_s3_policy_to_iam_role]
}



# Add a bucket notification to trigger the Lambda function on object creation in the "voice_files" folder
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.main_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.terraform_transcriber_executor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "voice_files/"
  }

  depends_on = [aws_lambda_permission.allow_s3_to_invoke_lambda]
}


# Allow S3 to invoke the Lambda function
resource "aws_lambda_permission" "allow_s3_to_invoke_lambda" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terraform_transcriber_executor.function_name
  principal     = "s3.amazonaws.com"

  # Use the bucket's ARN as the source ARN
  source_arn = aws_s3_bucket.main_bucket.arn
}
