output "main_bucket_arn" {
  value       = aws_s3_bucket.main_bucket.arn
  description = "the main bucket for voice files"
}
