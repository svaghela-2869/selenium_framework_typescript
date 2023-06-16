serial_cmd=`cat lib/runner/run.txt`

IFS=$'\n'
ADDR=( ${serial_cmd} )

for cmd in "${ADDR[@]}";
do

eval $cmd

done

exit