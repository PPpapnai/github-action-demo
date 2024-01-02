terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.80.0"
    }
  }
}
 
provider "azurerm" {
  subscription_id = "549cebc9-b1e5-466c-b256-31cedcb7df9c"
  client_id = "8bf5bc0b-51b4-47d3-b586-99060689a583"
  client_secret = "WSg8Q~92rsssdyw6Kpcud9P2ZhlAKKSPHfBfday."
  tenant_id = "65795da9-827f-449c-afaa-2de0dae21c7a"
  features {}
  skip_provider_registration = "true"
}