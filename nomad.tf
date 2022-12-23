provider "nomad" {}

variable "image_version" {
  default = "latest"
}

data "template_file" "job" {
  template = file("${path.module}/junat.live.nomad")

  vars = {
    image_version = "${var.image_version}"
  }
}

resource "nomad_job" "junat" {
  jobspec = data.template_file.job.rendered
}
