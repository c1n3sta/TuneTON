# Apply namespaces
kubectl apply -f namespaces/tuneton-namespace.yaml

# Apply volumes
kubectl apply -f volumes/postgres-pv.yaml
kubectl apply -f volumes/audio-storage.yaml
kubectl apply -f volumes/grafana-storage.yaml

# Apply secrets
kubectl apply -f secrets/postgres-secrets.yaml
kubectl apply -f secrets/auth-secrets.yaml
kubectl apply -f secrets/rabbitmq-secrets.yaml
kubectl apply -f secrets/grafana-secrets.yaml

# Apply PostgreSQL
kubectl apply -f deployments/postgres-deployment.yaml
kubectl apply -f services/postgres-service.yaml

# Apply RabbitMQ
kubectl apply -f deployments/rabbitmq-deployment.yaml
kubectl apply -f services/rabbitmq-service.yaml

# Apply Prometheus
kubectl apply -f configs/grafana-datasources.yaml
kubectl apply -f deployments/prometheus-deployment.yaml
kubectl apply -f services/prometheus-service.yaml

# Apply Grafana
kubectl apply -f deployments/grafana-deployment.yaml
kubectl apply -f services/grafana-service.yaml

# Apply services (alphabetical order)
kubectl apply -f deployments/api-gateway-deployment.yaml
kubectl apply -f services/api-gateway-service.yaml

kubectl apply -f deployments/auth-service-deployment.yaml
kubectl apply -f services/auth-service-service.yaml

kubectl apply -f deployments/audio-processing-service-deployment.yaml
kubectl apply -f services/audio-processing-service-service.yaml

kubectl apply -f deployments/playlist-service-deployment.yaml
kubectl apply -f services/playlist-service-service.yaml

kubectl apply -f deployments/streaming-service-deployment.yaml
kubectl apply -f services/streaming-service-service.yaml

kubectl apply -f deployments/track-service-deployment.yaml
kubectl apply -f services/track-service-service.yaml

kubectl apply -f deployments/user-service-deployment.yaml
kubectl apply -f services/user-service-service.yaml

# Apply Ingress
kubectl apply -f ingress/tuneton-ingress.yaml

# Print status
echo "=== Kubernetes Resources Status ==="
kubectl get pods -n tuneton
kubectl get svc -n tuneton
echo "\nTo access the application:"
echo "- API Gateway: http://localhost:80"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3000/grafana"
echo "- RabbitMQ Management: http://localhost:15672"
