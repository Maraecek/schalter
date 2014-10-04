#!/bin/bash

echo "curl 192.168.82.2/tor/aus;curl 192.168.82.2/verwaltung/aus;curl 192.168.82.2/lager/aus" | at -q p now $1
