#!/bin/bash
# filepath: create-storage-resources.sh
#
# This script creates an Azure Storage Account with containers and sets up RBAC
# so that the current user can access the storage using DefaultAzureCredential
# Prerequisites:
# - Install the Azure CLI and run: az login
#
# This script creates a storage account, containers, and sets up RBAC permissions

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
    # Reliable random string generation with multiple fallback methods
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

LOCATION="eastus"
RESOURCE_GROUP_NAME="sdk-test-storage-rg-$RANDOM_STRING"
STORAGE_ACCOUNT_NAME="sdkteststg$RANDOM_STRING"  # Storage account names must be lowercase, no dashes
CONTAINER_NAME="data-container-$RANDOM_STRING"
PRIVATE_CONTAINER_NAME="private-container-$RANDOM_STRING"

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

# Create a unique resource group and storage account using a random suffix
RG="$RESOURCE_GROUP_NAME"
printf "Resource Group: %s\n" "$RG"

STORAGE_NAME="$STORAGE_ACCOUNT_NAME"
printf "Storage Account Name: %s\n" "$STORAGE_NAME"

# Create a resource group
echo "Creating resource group..."
az group create \
    --subscription "$SUBSCRIPTION_ID" \
    --name "$RG" \
    --location "$LOCATION"
printf "Resource Group created successfully\n"

# Create a Storage Account with hierarchical namespace enabled for DataLake features
echo "Creating Storage Account..."
az storage account create \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --name "$STORAGE_NAME" \
    --location "$LOCATION" \
    --sku "Standard_LRS" \
    --kind "StorageV2" \
    --enable-hierarchical-namespace true \
    --default-action Allow
printf "Storage Account created successfully\n"

# Get the Storage Account connection string and endpoint
echo "Getting Storage Account connection string and endpoint..."
STORAGE_ACCOUNT_KEY=$(az storage account keys list \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --account-name "$STORAGE_NAME" \
    --query "[0].value" \
    --output tsv)

STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --name "$STORAGE_NAME" \
    --query "connectionString" \
    --output tsv)

# Get the blob endpoint
STORAGE_BLOB_ENDPOINT=$(az storage account show \
    --subscription "$SUBSCRIPTION_ID" \
    --resource-group "$RG" \
    --name "$STORAGE_NAME" \
    --query "primaryEndpoints.blob" \
    --output tsv)

printf "Storage Account endpoint: %s\n" "$STORAGE_BLOB_ENDPOINT"

# Create containers using connection string authentication for creation
echo "Creating containers..."
az storage container create \
    --name "$CONTAINER_NAME" \
    --account-name "$STORAGE_NAME" \
    --account-key "$STORAGE_ACCOUNT_KEY"
printf "Container '%s' created successfully\n" "$CONTAINER_NAME"

az storage container create \
    --name "$PRIVATE_CONTAINER_NAME" \
    --account-name "$STORAGE_NAME" \
    --account-key "$STORAGE_ACCOUNT_KEY" \
    --public-access off
printf "Private container '%s' created successfully\n" "$PRIVATE_CONTAINER_NAME"

# Assign RBAC roles for the current user
echo "Assigning Storage Blob Data Contributor role to current user..."
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee "$PRINCIPAL_ID" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Storage/storageAccounts/$STORAGE_NAME" \
    || echo "Warning: Role assignment already exists or failed"

# Wait for role propagation
echo "Waiting 20 seconds for RBAC role propagation..."
sleep 20

# Append the storage information to the .env file
if [ ! -f .env ]; then
    touch .env
fi

echo "AZURE_STORAGE_ACCOUNT=$STORAGE_NAME" >> .env
echo "AZURE_STORAGE_CONTAINER=$CONTAINER_NAME" >> .env
echo "AZURE_STORAGE_PRIVATE_CONTAINER=$PRIVATE_CONTAINER_NAME" >> .env
echo "AZURE_STORAGE_BLOB_ENDPOINT=$STORAGE_BLOB_ENDPOINT" >> .env

# Do not add connection strings to .env since we're using DefaultAzureCredential
# Comment out the following line - it's only here for reference
# echo "AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING" >> .env

# Ensure we have all the required values before completing
echo "Verifying all required values are present..."

# Check for empty values
if [ -z "$RG" ] || [ -z "$STORAGE_NAME" ] || [ -z "$CONTAINER_NAME" ] || [ -z "$STORAGE_BLOB_ENDPOINT" ]; then
    printf "Warning: One or more required values is empty:\n"
    printf "  Resource Group: %s\n" "$RG"
    printf "  Storage Account: %s\n" "$STORAGE_NAME"
    printf "  Container: %s\n" "$CONTAINER_NAME" 
    printf "  Blob Endpoint: %s\n" "$STORAGE_BLOB_ENDPOINT"
    printf "Script may have encountered issues.\n"
else
    printf "Script completed successfully!\n"
    printf "Resources created:\n"
    printf "  Resource Group: %s\n" "$RG"
    printf "  Storage Account: %s\n" "$STORAGE_NAME"
    printf "  Public Container: %s\n" "$CONTAINER_NAME"
    printf "  Private Container: %s\n" "$PRIVATE_CONTAINER_NAME"
    printf "  Blob Endpoint: %s\n" "$STORAGE_BLOB_ENDPOINT"
    printf "Environment variables have been added to .env file\n"
    printf "\nYou can now use DefaultAzureCredential to access this storage account\n"
fi
