#!/usr/bin/env python3

import json
import os
import shutil
import uuid

input_data_handle = open("data.json", "r")
input_audio_dir = "/Users/pes/Desktop/cecily_export"
output_audio_dir = "/tmp/cecily-final"

input_data = json.load(input_data_handle)
new_mapping_data = {}
for num, partial_file_names in input_data.items():
    new_mapping_data[num] = []
    for partial_file_name in partial_file_names:
        full_input_file_name = num + " " + partial_file_name + ".m4a"
        full_input_file_path = os.path.join(input_audio_dir, full_input_file_name)
        new_uuid = str(uuid.uuid4())
        full_output_file_path = os.path.join(output_audio_dir, new_uuid + ".m4a")
        shutil.copyfile(full_input_file_path, full_output_file_path)
        new_data_record = {
            "uuid": new_uuid,
            "name": partial_file_name,
        }
        new_mapping_data[num].append(new_data_record)

output_data_file = open(os.path.join(output_audio_dir, "data.json"), "w")
json.dump(new_mapping_data, output_data_file)
output_data_file.close()
