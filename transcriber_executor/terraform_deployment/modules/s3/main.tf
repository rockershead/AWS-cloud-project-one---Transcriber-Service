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

# Add a bucket notification to trigger the Lambda function on object creation in the "voice_files" folder
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.main_bucket.id

  lambda_function {
    lambda_function_arn = var.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "voice_files/"
  }

  depends_on = [var.allow_s3_to_invoke_lambda]
}
