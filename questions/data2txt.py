# This file converst the data.json format into a readable text file
# organize as follows:
#
# QUESTION # ?
# If our department ... blhah balhblahbalhb
#
# ANSWER: #
# text...
#
# etc

import json

json_data=open('data.json').read()

data = json.loads(json_data)

f = open('data_text.txt','w')
count = 1;
for question in data:
	f.write(question+'\n')
	answers = data[question]
	a = []
	n = []
	for answer in answers:
		if answers[answer]>1:
			a.append(answer)
			n.append(answers[answer])
	sortzip = sorted(zip(a,n),key=lambda pair:pair[1], reverse=True)
	n = [x for (y,x) in sortzip]
	a = [y for (y,x) in sortzip]
	for ai,ni in sortzip:
		f.write(ai + ' ' + str(ni) + '\n')
	f.write('\n**********************************************************\n\n')
