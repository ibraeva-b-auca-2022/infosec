#!/bin/bash
dir=$1
find "$dir" -type f -empty -print -delete

