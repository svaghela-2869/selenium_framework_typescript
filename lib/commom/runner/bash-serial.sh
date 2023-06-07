serial_cmd=`cat selenium-runner-final.txt`

IFS=$'\n'
ADDR=( ${serial_cmd} )

for cmd in "${ADDR[@]}";
do

eval $cmd

done

exit