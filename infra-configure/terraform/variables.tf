variable "aws_region" {
  description = "aws region"
  type        = string
}
variable "ami_id" {
  description = "aws instance ami_id"
  type        = string
}
variable "instance_type" {
  description = "aws instance_type"
  type        = string
}
variable "key_name" {
  description = "aws key-pair "
  type        = string
}
variable "security_group_id" {
  description = "aws security_group"
  type        = string
}