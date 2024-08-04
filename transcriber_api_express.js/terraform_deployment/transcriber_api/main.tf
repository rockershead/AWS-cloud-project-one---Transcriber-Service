data "aws_caller_identity" "current_caller_for_vpc" {}

output "url" { value = "http://${aws_lb.my_lb.dns_name}" }
