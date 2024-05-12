### Deployment Results {{ ":rocket:" if status === "success" else ":cry:" }}

{{ actor }} deployed branch `{{ ref }}` to the **{{ environment }}** environment. This deployment was a {{ status }} {{ ":rocket:" if status === "success" else ":cry:" }}.

{% if environment_url %}You can view the deployment [here]({{ environment_url }}).{% endif %}

{% if noop %}This was a noop deployment.{% endif %}