#!/bin/bash

# Prerequisites: 
# Azure CLI installed
# `az login`

# Read .env file in the script
set -a
source ../.env

random_string() {
    cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 10 | head -n 1
}
RANDOM_STRING=$(random_string)

printf "Subscription ID: $SUBSCRIPTION_ID\n"
printf "Location: $LOCATION\n"
printf "Cosmos DB Database: $COSMOS_DATABASE_NAME\n"
printf "Cosmos DB Container name: $COSMOS_CONTAINER_NAME\n"

RG="$RESOURCE_GROUP_NAME$RANDOM_STRING"
printf "Resource Group: $RG\n"

RESOURCE_NAME="$COSMOS_DB_RESOURCE_NAME$RANDOM_STRING"
printf "Resource Name: $RESOURCE_NAME\n"

# Create a resource group
az group create \
    --subscription $SUBSCRIPTION_ID \
    --name "$RG" \
    --location $LOCATION
printf "Resource Group created\n"

# Create a Cosmos DB account
az cosmosdb create \
    --subscription $SUBSCRIPTION_ID \
    --resource-group $RG \
    --name $RESOURCE_NAME \
    --kind MongoDB \
    --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=False
printf "Cosmos DB account created\n"

# Get the Cosmos DB account endpoint
COSMOS_DB_ENDPOINT=$(az cosmosdb show \
    --subscription $SUBSCRIPTION_ID \
    --resource-group $RG \
    --name $RESOURCE_NAME \
    --query "documentEndpoint" \
    --output tsv)
printf "Cosmos DB Endpoint: $COSMOS_DB_ENDPOINT\n"

# Append the endpoint to the .env file
echo "COSMOS_DB_ENDPOINT=$COSMOS_DB_ENDPOINT" >> ../.env

echo "Cosmos DB Endpoint: $COSMOS_DB_ENDPOINT"
