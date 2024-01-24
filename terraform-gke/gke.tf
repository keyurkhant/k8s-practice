variable "gke_num_nodes" {
  default     = 3
  description = "Number of GKE nodes"
}

# GKE cluster
resource "google_container_cluster" "primary" {
  project = "cloud-assignment-k8s"
  name     = "cloud-assignment-k8s-gke"
  location = "us-east1-b"
  remove_default_node_pool = true
  initial_node_count = 3
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  project = "cloud-assignment-k8s"
  name       = "${google_container_cluster.primary.name}-node-pool"
  location   = "us-east1-b"
  cluster    = google_container_cluster.primary.name
  node_count = var.gke_num_nodes

  node_config {
    machine_type    = "e2-medium"
    disk_type  = "pd-standard"
    disk_size_gb = 20
    image_type      = "COS_CONTAINERD"
    preemptible     = false
   

    labels = {
      env = "cloud-assignment-k8s"
    }
  }
}