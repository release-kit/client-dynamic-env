#!/bin/bash

########################################
## Save current environment variables ##
########################################

export -p > .cde-saved-env

################################
## Load environment variables ##
################################

set -o allexport

# Run twice to expand variables in higher-priority env files
for i in 1 2
do
  for file in $CDE_ENV_DIR/.env $CDE_ENV_DIR/.env.$CDE_ENV $CDE_ENV_DIR/.env.$CDE_ENV.local $CDE_ENV_DIR/.env.local
  do
    if [[ -f $file ]]; then
      source $file
    fi
  done
done

set +o allexport

#################################################
##    Restore saved environment variables      ##
## Globally defined envs should be #1 priority ##
#################################################

source .cde-saved-env
rm .cde-saved-env

###################
## Generate JSON ##
###################

json="{"

envs=$(compgen -A variable | grep $CDE_ENV_PREFIX)

for env in $envs; do
  escaped="${!env/\"/\\\"}"
  json+="\"$env\":\"$escaped\",";
done

json=${json%?}
json+="}"

##########################
## Write to destination ##
##########################

encoded=$(echo $json | base64 -w 0)

sed -i "s|$CDE_SLOT|$encoded|" $CDE_DESTINATION
