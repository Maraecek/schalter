#!/bin/sh

cd /var/www/schalter/
while true;
do
	/bin/nc -v -l 8181 | tail -1 > status.log
	cp status.log swstate.js
	sleep 1
done
