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
from collections import OrderedDict

json_data=open('data.json').read()

data = json.loads(json_data, object_pairs_hook=OrderedDict) #loads data while maintaining order from file

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
	anum = 1;
	for ai,ni in sortzip:
		f.write(str(anum) + ': ' + ai + ' ' + str(ni) + '\n')
		anum+=1
	f.write('\n**********************************************************\n\n')
