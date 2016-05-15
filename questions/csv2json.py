import csv
import json

length = 32 # hard coded, 32 total questions
data = {}
with open('qa.csv','r') as f:
	reader = csv.reader(f)
	for row in reader:
		cur = {}
		for i in range(1,32):
			item = row[i]
			if item in cur.keys():
				cur[item]+=1
			else:
				cur[item] = 1
		data[row[0]] = cur

for question in data.keys():
	print(question)
	for answer in data[question].keys():
		print(answer)
		print(data[question][answer])

f = open('data.json','w')
json.dump(data,f)