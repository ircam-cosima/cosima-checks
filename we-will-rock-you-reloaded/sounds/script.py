import csv
import json
import sys

time = []
duration = []
offset = []
energy = []

def loadArrays(filename):
  with open(filename + '-markers.txt') as f:
    bl = [[],[],[]]
    reader = csv.reader(f, delimiter=" ")
    for row in reader:
      for col in range(3):
        bl[col].append(float(row[col]))
  return bl

def convertTime(time_raw):
  for t in time_raw:
  	time.append(t / 1000)

def convertDuration(duration_raw):
  for d in duration_raw:
    duration.append(d / 1000)

def convertOffset(duration_raw):
  for d in duration_raw:
    offset.append(-0.005)

def convertEnergy(energy_raw):
  e_max = max(energy_raw)
  e_min = min(energy_raw)
  for e in energy_raw:
    energy.append( (e - e_min) / (e_max - e_min) )

def tojson(filename):
  bl = loadArrays(filename)
  time_raw = bl[0]
  duration_raw = bl[1]
  energy_raw = bl[2]
  convertTime(time_raw)
  convertDuration(duration_raw)
  convertEnergy(duration_raw)
  convertOffset(energy_raw)
  jsonObject = {
    "time": time,
    # "duration": duration,
    "offset": offset,
    "energy": energy
  }
  with open(filename + '-markers.json', 'w') as outfile:
    json.dump(jsonObject, outfile)

tojson(sys.argv[1])