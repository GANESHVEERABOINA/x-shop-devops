resource "aws_instance" "website" {
  count             = 3
  ami               = var.ami_id
  instance_type     = var.instance_type
  key_name          = var.key_name
  vpc_security_group_ids = [var.security_group_id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = count.index == 0 ? "k3s-master" : "k3s-worker-${count.index}"
    Role = count.index == 0 ? "Master" : "Worker_${count.index}"
  }
}
