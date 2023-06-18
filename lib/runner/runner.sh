run_type=("${1}")

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
else
    echo -e "refer below options for running spec : \n\nnpm test create \n- to generate required spec files ( mention spec details in selenium-spec-create.txt ) \n\nnpm test serial \n- to run the cases serially \n\nnpm test parallel \n- to run the cases parallely \n\nnpm test docker \n- to run the case in docker"
fi