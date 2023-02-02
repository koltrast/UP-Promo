#!/usr/bin/env python

# modules
import sys
import pandas as pd

# dataframe
data = pd.DataFrame({
    "A": [25, 30, 35, 40, 50, 60, 75, 90, 110],
    "B": [30, 35, 40, 45, 55, 65, 80, 95, 115],
    "C": [10, 15, 20, 25, 35, 45, 55, 70, 90]})

# exec
logo = ('''
 __   __  _______ 
|  | |  ||    _  |
|  |_|  ||   |_| |
|       ||    ___|
|_______||___|2023
ŒUVRIR
''')

obj = []
price = []

while True:
	tranche = None
	item = []
	while True:
		value = input("Enter value \n")
		while not value.isdigit():
		    item.append(value)
		    value = input("Enter value \n")

		tranche = int(value)
		break

	for i in range(len(item)):
		price.append(data.at[tranche, item[i]])
		if item[i] == "A":
			obj.append("veste")
		elif item[i] == "B":
			obj.append("combinaison")
		elif item[i] == "C":
			obj.append("casquette")

	with open("ticket.tmp", "w", encoding="utf-8") as f:
		import os
		f.write(f"{logo}\n\n")
		if tranche <= 1:
			f.write(f"Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n")
		elif tranche > 1:
			f.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}e et le {tranche+1}e décile.\n")
		elif tranche == 9:
			f.write(f"Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n")
		f.write(f"\nAfin de garantir une équité tarifaire\n")
		if len(item) > 1:
			f.write(f"les prix ont été ajustés.\n\n")
		else:
			f.write(f"le prix a été ajusté.\n\n")
		for i in range(len(obj)):
			f.write(f"- {obj[i]} {price[i]}€\n")
		f.write(f"\n TOTAL : {sum(price)}€")
		f.write(f"\n\nTickets imprimé en 2 exemplaires")
		os.system("lpr -P EPSON_TM-T20III ticket.tmp")
		f.write(f"\n\nexemplaire UP")
		os.system("lpr -P EPSON_TM-T20III ticket.tmp")
