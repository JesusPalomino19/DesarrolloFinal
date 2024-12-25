provider "aws" {
  region  = "us-east-1"
  profile = "default"
}

terraform {
   required_version = ">= 0.12"
   required_providers {
       mongodbatlas = {
           source = "mongodb/mongodbatlas"
           version = "1.14.0"
       }
   }
}

