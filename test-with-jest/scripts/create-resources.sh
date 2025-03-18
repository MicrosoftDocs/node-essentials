#!/bin/bash
# filepath: create-resources.sh

# Prerequisites:
# - Install the Azure CLI and run: az login
#
# This script now fetches the role definition id for "Cosmos DB Operator" automatically.

# Exit if any command returns a non-zero status
# set -euo

# Verify that the user is logged in
if ! az account show > /dev/null 2>&1; then
  echo "Error: Not logged in to Azure CLI. Please run 'az login' and try again."
  exit 1
fi

random_string() {
    tr -dc 'a-z0-9' </dev/urandom | fold -w 10 | head -n 1
}
RANDOM_STRING=$(random_string)
printf "Random String: %s\n" "$RANDOM_STRING"

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
LOCATION="eastus"
RESOURCE_GROUP_NAME="cosmosdb-rg-$RANDOM_STRING"
COSMOS_DB_RESOURCE_NAME="cosmosdb-$RANDOM_STRING"
PRINCIPAL_ID=$(az ad signed-in-user show --query id -o tsv)

# Create a unique resource group and cosmos db name using a random suffix.
RG="${RESOURCE_GROUP_NAME}${RANDOM_STRING}"
printf "Resource Group: %s\n" "$RG"

RESOURCE_NAME="${COSMOS_DB_RESOURCE_NAME}${RANDOM_STRING}"
printf "Resource Name: %s\n" "$RESOURCE_NAME"

# Create a resource group
az group create \
    --subscription "$SUBSCRIPTION_ID" \
    --name "$RG" \
    --location "$LOCATION"
printf "Resource Group created\n"

# Create a Cosmos DB account (for example, using MongoDB API)
az cosmosdb create \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --name "$RESOURCE_NAME" \
    --kind MongoDB \
    --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False
printf "Cosmos DB account created\n"

# Get the Cosmos DB account endpoint
COSMOS_DB_ENDPOINT=$(az cosmosdb show \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --name "$RESOURCE_NAME" \
    --query "documentEndpoint" \
    --output tsv)
printf "Cosmos DB Endpoint: %s\n" "$COSMOS_DB_ENDPOINT"

# Append the endpoint to the .env file if not already populated
echo "COSMOS_DB_ENDPOINT=$COSMOS_DB_ENDPOINT" >> .env

echo "Cosmos DB Endpoint: $COSMOS_DB_ENDPOINT"

# Dynamically fetch the role definition id for "Cosmos DB Operator"
ROLE_DEFINITION_ID=$(az role definition list --name "Cosmos DB Operator" --query "[0].id" -o tsv)
printf "Role Definition ID: %s\n" "$ROLE_DEFINITION_ID"


printf "Pricipal ID: %s\n" "$PRINCIPAL_ID"

# Create a role assignment using the fetched role definition.
az role assignment create \
    --assignee "$PRINCIPAL_ID" \
    --role "$ROLE_DEFINITION_ID" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG"
printf "Role assignment created\n"
