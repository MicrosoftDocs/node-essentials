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
RESOURCE_GROUP_NAME="sdk-test-cosmosdb-rg-$RANDOM_STRING"
COSMOS_DB_RESOURCE_NAME="sdk-test-cosmosdb-$RANDOM_STRING"
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
    --kind GlobalDocumentDB \
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


# --------------------------------------------------------------------------
# Create a Cosmos DB SQL database and container, and update .env with their values

# Set database and container names
DB_NAME="db-$RANDOM_STRING"
CONTAINER_NAME="container-$RANDOM_STRING"

# Create a database (using throughput of 400 RU/s as an example)
az cosmosdb sql database create \
    --account-name "$RESOURCE_NAME" \
    --name "$DB_NAME" \
    --resource-group "$RG" \
    --subscription "$SUBSCRIPTION_ID" \
    --throughput 400
echo "COSMOS_DATABASE_NAME=$DB_NAME" >> .env
printf "Cosmos DB SQL database '%s' created\n" "$DB_NAME"

# Create a container (using throughput of 400 RU/s as an example)
az cosmosdb sql container create \
    --account-name "$RESOURCE_NAME" \
    --database-name "$DB_NAME" \
    --name "$CONTAINER_NAME" \
    --partition-key-path "/name" \
    --resource-group "$RG" \
    --subscription "$SUBSCRIPTION_ID" \
    --throughput 400
echo "COSMOS_CONTAINER_NAME=$CONTAINER_NAME" >> .env
printf "Cosmos DB SQL container '%s' created\n" "$CONTAINER_NAME"

printf "Database and container names appended to .env\n"
--------------------------------------------------------------------------

# Role definition id for "Cosmos DB Operator"

# Create a role assignment using the fetched role definition.
az cosmosdb sql role assignment create \
    --resource-group "$RG" \
    --account-name "$RESOURCE_NAME" \
    --role-definition-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.DocumentDB/databaseAccounts/$RESOURCE_NAME/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002" \
    --principal-id "$PRINCIPAL_ID" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.DocumentDB/databaseAccounts/$RESOURCE_NAME"