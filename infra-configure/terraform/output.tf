output "public_ips" {
  value = aws_instance.website[*].public_ip
}