job "junat" {
  datacenters = ["eu-west-1"]

  group "website" {
    network {
      port "http" {
        to = 3000
      }
    }

    task "frontend" {
      driver = "docker"

      config {
        image          = "nykanen/junat:${image_version}"
        ports          = ["http"]
        auth_soft_fail = true
      }

      env {
        SENTRY_DSN = "${sentry_dsn}"
      }

      service {
        name     = "junat"
        port     = "http"
        provider = "nomad"
        tags = [
          "traefik.http.routers.http.rule=Host(`junat.live`)",
        ]
      }

      resources {
        cpu    = 100 #MHz
        memory = 256 #MB
      }
    }
  }
}
