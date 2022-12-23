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
        image          = "nykanen/junat:latest"
        ports          = ["http"]
        auth_soft_fail = true
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
