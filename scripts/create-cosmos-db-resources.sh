#!/bin/bash
# filepath: create-resources.sh

# Prerequisites:
# - Install the Azure CLI and run: az login
#
# This script now fetches the role definition id for "Cosmos DB Operator" automatically.

# Exit if any command returns a non-zero status
set -euo pipefail

echo "Script started - checking prerequisites..."

# Verify that the user is logged in
echo "Checking Azure CLI login status..."
if ! az account show > /dev/null 2>&1; then
  echo "Error: Not logged in to Azure CLI. Please run 'az login' and try again."
  exit 1
fi
echo "Azure CLI login verified."

random_string() {
    # More reliable random string generation with multiple fallback methods
    # Method 1: Using built-in RANDOM variable (most compatible)
    local result=""
    local chars="abcdefghijklmnopqrstuvwxyz0123456789"
    local length=6  # Shorter 6-character string
    
    # Generate random string using bash's RANDOM
    for i in {1..6}; do
        local idx=$((RANDOM % 36))
        result+=${chars:$idx:1}
    done
    
    # If result is empty for some reason, use timestamp as fallback
    if [ -z "$result" ]; then
        result=$(date +%s | cut -c 7-12)
    fi
    
    echo "$result"
}

echo "Generating random string..."
RANDOM_STRING=$(random_string)
echo "Random string generated successfully: $RANDOM_STRING"

echo "Getting Azure subscription information..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "Subscription ID retrieved: $SUBSCRIPTION_ID"

LOCATION="centralus"
RESOURCE_GROUP_NAME="sdk-test-cosmosdb-rg-$RANDOM_STRING"
COSMOS_DB_RESOURCE_NAME="sdk-test-cosmosdb-$RANDOM_STRING"

echo "Getting principal ID..."
# Try different approaches to get the user's principal ID, with verbose error handling
if ! PRINCIPAL_ID=$(az ad signed-in-user show --query id -o tsv 2>/dev/null); then
  echo "Failed to get principal ID using signed-in-user, trying alternative method..."
  USER_NAME=$(az account show --query user.name -o tsv)
  echo "Got user name: $USER_NAME, looking up user ID..."
  
  if ! PRINCIPAL_ID=$(az ad user show --id "$USER_NAME" --query id -o tsv 2>/dev/null); then
    echo "Error: Could not determine principal ID. Using current account credentials for roles."
    PRINCIPAL_ID=$(az account show --query id -o tsv)
  fi
fi
echo "Principal ID retrieved: $PRINCIPAL_ID"

# Create a unique resource group and cosmos db name using a random suffix.
RG="$RESOURCE_GROUP_NAME"
printf "Resource Group: %s\n" "$RG"

RESOURCE_NAME="$COSMOS_DB_RESOURCE_NAME"
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
if [ ! -f .env ]; then
    touch .env
fi
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

# --------------------------------------------------------------------------
# Role assignment for Cosmos DB access

# Get the role definition ID for "Cosmos DB Built-in Data Contributor"
echo "Getting role definitions..."
ROLE_DEFS=$(az cosmosdb sql role definition list \
    --resource-group "$RG" \
    --account-name "$RESOURCE_NAME")
echo "Role definitions retrieved: $ROLE_DEFS"

echo "Querying for Cosmos DB Built-in Data Contributor role..."
ROLE_DEF_ID=$(az cosmosdb sql role definition list \
    --resource-group "$RG" \
    --account-name "$RESOURCE_NAME" \
    --query "[?roleName=='Cosmos DB Built-in Data Contributor'].id" \
    --output tsv)

if [ -z "$ROLE_DEF_ID" ]; then
    echo "Role definition ID not found. Using fallback ID."
    # Fallback to the well-known ID if not found
    ROLE_DEF_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.DocumentDB/databaseAccounts/$RESOURCE_NAME/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
    printf "Using fallback role definition ID: %s\n" "$ROLE_DEF_ID"
else
    printf "Found role definition ID: %s\n" "$ROLE_DEF_ID"
fi

# Create a role assignment using the built-in data contributor role
echo "Creating role assignment..."
if ! az cosmosdb sql role assignment create \
    --resource-group "$RG" \
    --account-name "$RESOURCE_NAME" \
    --role-definition-id "$ROLE_DEF_ID" \
    --principal-id "$PRINCIPAL_ID" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.DocumentDB/databaseAccounts/$RESOURCE_NAME"; then
    
    echo "Warning: Failed to create role assignment. This might be because it already exists or due to permission issues."
    echo "Continuing with script execution..."
else
    printf "Role assignment created successfully\n"
fi

# List role assignments to verify
az cosmosdb sql role assignment list \
    --resource-group "$RG" \
    --account-name "$RESOURCE_NAME"

# Ensure we have all the required values before completing
echo "Verifying all required values are present..."

# Check for empty values
if [ -z "$RG" ] || [ -z "$RESOURCE_NAME" ] || [ -z "$DB_NAME" ] || [ -z "$CONTAINER_NAME" ] || [ -z "$COSMOS_DB_ENDPOINT" ]; then
    printf "Warning: One or more required values is empty:\n"
    printf "  Resource Group: %s\n" "$RG"
    printf "  Cosmos DB Account: %s\n" "$RESOURCE_NAME"
    printf "  Database: %s\n" "$DB_NAME" 
    printf "  Container: %s\n" "$CONTAINER_NAME"
    printf "  Endpoint: %s\n" "$COSMOS_DB_ENDPOINT"
    printf "Script may have encountered issues.\n"
else
    printf "Script completed successfully!\n"
    printf "Resources created:\n"
    printf "  Resource Group: %s\n" "$RG"
    printf "  Cosmos DB Account: %s\n" "$RESOURCE_NAME"
    printf "  Database: %s\n" "$DB_NAME"
    printf "  Container: %s\n" "$CONTAINER_NAME"
    printf "  Endpoint: %s\n" "$COSMOS_DB_ENDPOINT"
    printf "Environment variables have been added to .env file\n"
fi