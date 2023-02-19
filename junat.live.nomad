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
        SENTRY_DSN        = "${sentry_dsn}"
        SENTRY_AUTH_TOKEN = "${sentry_auth_token}"
      }

      service {
        name     = "junat"
        port     = "http"
        provider = "nomad"
        tags = [
          "traefik.http.routers.http.rule=Host(`junat.live`)",
          "traefik.http.middlewares.headers.headers.frameDeny=true",
          "traefik.http.middlewares.headers.headers.contentTypeNosniff=true",
          "traefik.http.middlewares.headers.headers.accessControlAllowOriginList=*",
          "traefik.http.middlewares.headers.headers.referrerPolicy=strict-origin-when-cross-origin",
          "traefik.http.middlewares.headers.headers.contentSecurityPolicy=\"default-src 'self';object-src 'none';form-action 'self';script-src 'self';connect-src 'self' fonts.gstatic.com wss://rata.digitraffic.fi *.junat.live rata.digitraffic.fi;font-src fonts.gstatic.com;style-src 'self' 'unsafe-inline';img-src 'self';manifest-src 'self';prefetch-src 'self';\"",
          "traefik.http.routers.http.middlewares=headers"
        ]
      }

      resources {
        cpu    = 100 #MHz
        memory = 256 #MB
      }
    }
  }
}
