resource "aws_s3_bucket" "main_bucket" {
  bucket = var.bucket_name
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

# Add a bucket notification to trigger the sqs queue
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.main_bucket.id

  queue {
    queue_arn     = aws_sqs_queue.transcriber_sqs_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "voice_files/"
  }

  depends_on = [aws_sqs_queue_policy.s3_event_queue_policy]
}
