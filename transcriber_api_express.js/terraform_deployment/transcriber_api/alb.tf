resource "aws_security_group" "alb_sg" {
  name   = "${var.ecs_service_name}_alb_sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}



resource "aws_lb_target_group" "my_tg" {
  name        = "${var.ecs_service_name}-tg"
  port        = var.container_port ##8087
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}



##creating the alb proper
resource "aws_lb" "my_lb" {
  name               = "${var.ecs_service_name}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [for subnet in aws_subnet.public_subnets : subnet.id]
}

#listener rule
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my_tg.arn
  }
}



##route 53 config. in this case I am using alias

data "aws_route53_zone" "my_zone" {
  name = var.domain_name # Replace with your domain name
}

resource "aws_route53_record" "alias_record" {
  zone_id = data.aws_route53_zone.my_zone.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.my_lb.dns_name
    zone_id                = aws_lb.my_lb.zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_lb.my_lb]
}


##for acm ssl cert

data "aws_acm_certificate" "amazon_issued" {
  domain = "www.${var.domain_name}"
  types  = ["AMAZON_ISSUED"]
  #most_recent = true
}

# New Listener on Port 443 with SSL/TLS
resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.my_lb.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-TLS13-1-2-2021-06" # You can use a different policy
  certificate_arn = data.aws_acm_certificate.amazon_issued.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my_tg.arn
  }
}
