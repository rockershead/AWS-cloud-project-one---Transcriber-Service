resource "aws_ssm_parameter" "api_params" {
  count = length(var.parameter_store_keys)
  name  = var.parameter_store_keys[count.index]
  type  = "String"
  value = var.ssm_parameter_values[count.index]


}
