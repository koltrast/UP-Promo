#!/usr/bin/env python

# modules
import sys
import pandas as pd

# global variables
a = 0
tranche = None
item = []
obj = []
price = []
logo = ('''
 __   __  _______ 
|  | |  ||    _  |
|  |_|  ||   |_| |
|       ||    ___| h
|_______||___|2023
ŒUVRIR
''')

# dataframe
data = pd.DataFrame({
    "A": [25, 30, 35, 40, 50, 60, 75, 90, 110],
    "B": [30, 35, 40, 45, 55, 65, 80, 95, 115],
    "C": [10, 15, 20, 25, 35, 45, 55, 70, 90]})

# functions
def ticket():
	with open("ticket.tmp", "w", encoding="utf-8") as f:
		f.write(f"{logo}\n\n")
		if tranche <= 1:
			f.write(f"Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n")
		elif tranche > 1:
			f.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}e et le {tranche+1}e décile.\n")
		elif tranche == 9:
			f.write(f"Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n")
		f.write(f"\nAfin de garantir une equité tarifaire\n")
		if len(item) > 1:
			f.write(f"les prix ont été ajustés.\n\n")
		else:
			f.write(f"le prix à été ajusté.\n\n")
		for i in range(len(obj)):
			f.write(f"- {obj[i]} {price[i]}€\n")
		f.write(f"\nTOTAL :		                {sum(price)}€")


def to_printer_cli():
	import os
	os.system("lpr -P EPSON_TM-T20III ticket.tmp")
	print("done")

def to_printer_sel():
	with open("ticket.tmp", "a", encoding="utf-8") as f:
		f.write("\n\nexemplaire UP")
		import os
		os.system("lpr -P EPSON_TM-T20III ticket-sel.tmp")

# exec
while a == 0:
	value = input("Enter value \n")
	if value.isdigit():
		tranche = int(value)
		if not item:
			a = 0
		else:
			a = 1
	else:
		item.append(value)
		if tranche is None:
			a = 0
		else:
			a = 1

for i in range(len(item)):
	price.append(data.at[tranche, item[i]])
	if item[i] == "A":
		obj.append("veste                     ")
	elif item[i] == "B":
		obj.append("combinaison               ")
	elif item[i] == "C":
		obj.append("casquette                 ")

ticket()
to_printer_cli()
to_printer_sel()
