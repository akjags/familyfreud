import csv
import json

length = 33 # hard coded, total number of columns 
data = {}
with open('answers2017.csv','r') as f:
	reader = csv.reader(f)
	questions = reader.next()[1:]
	data = dict([(q,{}) for q in questions])
	for row in reader:
		for i in range(1,length):
			cur = data[questions[i-1]]
			item = row[i]
			if item in cur.keys():
				cur[item]+=1
			else:
				cur[item] = 1

for question in data.keys():
	print(question)
	for answer in data[question].keys():
		print(answer)
		print(data[question][answer])

f = open('data.json','w')
json.dump(data,f)
