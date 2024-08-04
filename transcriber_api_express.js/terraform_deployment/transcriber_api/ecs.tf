
##create ecs cluster

resource "aws_ecs_cluster" "my_cluster" {
  name = "${var.ecs_service_name}_cluster"
}


##ecs_task_execution_role


resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.ecs_service_name}-executionrole"
  description        = "ECS execution role"
  assume_role_policy = data.aws_iam_policy_document.assume_ecs_execution_role.json

  inline_policy {
    name   = "ecs_execution_role_policy"
    policy = data.aws_iam_policy_document.ecs_execution_role_permissions.json
  }
}


data "aws_iam_policy_document" "assume_ecs_execution_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}


data "aws_iam_policy_document" "ecs_execution_role_permissions" {


  statement {
    actions = [
      "kms:Create*",
      "kms:Describe*",
      "kms:Enable*",
      "kms:List*",
      "kms:Put*",
      "kms:Update*",
      "kms:Revoke*",
      "kms:Disable*",
      "kms:Get*",
      "kms:Delete*",
      "kms:TagResource",
      "kms:UntagResource",
      "kms:ScheduleKeyDeletion",
      "kms:CancelKeyDeletion"
    ]
    resources = ["*"]
    effect    = "Allow"
  }


  statement {
    actions = [
      "ecr:DescribeImageScanFindings",
      "ecr:GetLifecyclePolicyPreview",
      "ecr:CreateRepository",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetAuthorizationToken",
      "ecr:ListTagsForResource",
      "ecr:ListImages",
      "ecr:DeleteLifecyclePolicy",
      "ecr:DeleteRepository",
      "ecr:SetRepositoryPolicy",
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:DescribeRepositories",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetRepositoryPolicy",
      "ecr:GetLifecyclePolicy",
      "ecr:TagResource"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
  ##ssm permissions
  statement {
    actions = [
      "ssm:GetParametersByPath",
      "ssm:GetParameters",
      "ssm:GetParameter",
      "kms:Decrypt",

    ]
    resources = ["*"]
    effect    = "Allow"
  }

  ##cloudwatch permissions
  statement {
    actions = [

      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",

    ]
    resources = ["*"]
    effect    = "Allow"
  }



}

##to resolve issue where log stream not found
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/${var.ecs_service_name}"
  #retention_in_days = 30  # Optional: set the retention period for logs

}


##ecs task definition

resource "aws_ecs_task_definition" "my_task" {
  family                   = "my-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn ##very impt if not cannot do container pull

  container_definitions = jsonencode([{
    name      = var.ecs_service_name
    image     = var.ecr_repo_url
    essential = true
    portMappings = [{
      containerPort = var.container_port
      hostPort      = var.container_port
    }]
    environment = [
      for index, name in var.parameter_store_keys : {
        name  = name
        value = element(var.ssm_parameter_values, index)
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.ecs_service_name}"
        awslogs-region        = "ap-southeast-1"
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  depends_on = [aws_ssm_parameter.api_params, aws_iam_role.ecs_task_execution_role, aws_cloudwatch_log_group.ecs_log_group]
}


##ecs service security group
##need to recheck this
resource "aws_security_group" "ecs_service_sg" {
  name   = "${var.ecs_service_name}_ecs_sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1" ##means all.that means from and to_port must put 0
    security_groups = [aws_security_group.alb_sg.id]
    description     = "HTTP ingress from the public ALB"
  }

  #ingress {
  #from_port   = 0
  #to_port     = 65535
  #protocol    = "-1"
  #cidr_blocks = [aws_security_group.ecs_service_sg.id]
  # description = "Ingress from other containers in the same security group"

  #}

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    description = "Permit all outgoing requests to the internet"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


##create the ecs service
resource "aws_ecs_service" "my_service" {
  name            = var.ecs_service_name
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = tolist(aws_subnet.public_subnets[*].id) ##must be subnet_ids
    security_groups  = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true ##very impt if not cannot do container pull
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.my_tg.arn
    container_name   = var.ecs_service_name
    container_port   = var.container_port
  }

  depends_on = [aws_lb.my_lb,
    aws_ecs_task_definition.my_task,
  aws_security_group.ecs_service_sg]
}


