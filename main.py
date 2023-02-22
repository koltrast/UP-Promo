#!/usr/bin/env python

# modules
import os
import pandas as pd

# dataframe
data = pd.DataFrame({
    "UP-VST-23": [25, 30, 35, 40, 50, 60, 75, 90, 110],
    "UP-CMB-23": [30, 35, 40, 45, 55, 65, 80, 95, 115],
    "UP-CSQ-23": [10, 15, 20, 25, 35, 45, 55, 70, 90]})

# exec
logo = ('''
 __   __  _______ 
|  | |  ||    _  |
|  |_|  ||   |_| |
|       ||    ___|
|_______||___|2023
ŒUVRIR
''')


while True:
	obj = []
	price = []
	tranche = None
	item = []

	while True:
		value = input("Enter value :\n")
		if value in data.columns:
			item.append(value)
		else:
			try:
				tranche = int(value)
				if not item:
					with open("error.tmp", "w", encoding="utf-8") as e:
						e.write(f"\n\n Veuillez scanner un article en premier.\n\n")
					os.system("lpr -P EPSON_TM-T20III error.tmp -o cpi=14 -o lpi=7")
					os.remove("error.tmp")
					break
				break
			except ValueError:
				print("Invalid input. Please enter a valid column name or integer.")
	
	if item:
		for i in range(len(item)):
			price.append(data.at[tranche, item[i]])
			if item[i] == "UP-VST-23":
				obj.append("veste")
			elif item[i] == "UP-CMB-23":
				obj.append("combinaison")
			elif item[i] == "UP-CSQ-23":
				obj.append("casquette")
	
		with open("ticket.tmp", "w", encoding="utf-8") as f:
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
			f.write(f"\nTOTAL : {sum(price)}€")
			f.write(f"\n\nVous venez de contribuer au\nfinancement d'outils mutualisés\ndestiné à l'association\nComité des Choses Concrètes.\n\nTickets imprimé en 2 exemplaires,\nfaisant fois d'authenticité.")
			
		os.system("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=14 -o lpi=7")
		
		with open("ticket.tmp", "a", encoding="utf-8") as f:
			f.write(f"\n\nexemplaire Union Pragmatique\n\n\n\n")
			
		os.system("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=14 -o lpi=7")
		#os.remove("ticket.tmp")
		
		with open("trace.csv", "a", encoding="utf-8") as t:
			t.write(f"{tranche}; {item}; {price}; {sum(price)}\n")
