provider "nomad" {}

variable "image_version" {
  default = "latest"
}

variable "sentry_dsn" {
  description = "The Data Source Name used for Sentry (https://docs.sentry.io/product/sentry-basics/dsn-explainer/)"
  type        = string
  sensitive   = true
}


variable "sentry_auth_token" {
  type      = string
  sensitive = true
}

data "template_file" "job" {
  template = file("${path.module}/junat.live.nomad")

  vars = {
    image_version     = "${var.image_version}"
    sentry_dsn        = "${var.sentry_dsn}"
    sentry_auth_token = "${var.sentry_auth_token}"
  }
}

resource "nomad_job" "junat" {
  jobspec = data.template_file.job.rendered
}
