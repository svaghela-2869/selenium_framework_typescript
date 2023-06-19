npx sortjson && sleep 1 && clear

npx prettier --write . && sleep 1 && clear

run_type=("${1}")

options_available="refer below available options for 'npm test' : \n\n1. npm test create \n-> to generate required spec files ( mention spec details in selenium-spec-create.txt ) \n\n2. npm test serial \n-> to run the cases serially ( specs will run locally ) \n\n3. npm test parallel \n-> to run the cases parallely ( specs will run locally ) \n\n4. npm test docker \n-> to run the case in docker ( you will also get video of running spec )"

if [[ "${run_type}" == "create" ]]; then
    ts-node "lib/runner/selenium-spec-create.ts"
elif [[ "${run_type}" == "serial" ]]; then
    ts-node "lib/runner/selenium-runner-serial.ts"
    bash "lib/runner/bash-serial.sh"
elif [[ "${run_type}" == "parallel" ]]; then
    ts-node "lib/runner/selenium-runner-parallel.ts"
    bash "lib/runner/bash-parallel.sh"
elif [[ "${run_type}" == "docker" ]]; then
    ts-node "lib/runner/selenium-runner-docker.ts"
    bash "lib/runner/bash-docker.sh"
elif [[ "${run_type}" == "help" ]]; then
    echo -e $options_available
else
    echo -e $options_available
fi