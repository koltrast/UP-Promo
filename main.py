#!/usr/bin/env python

# modules
import os
import pandas as pd
import time
from time import sleep

# dataframe
data = pd.DataFrame({
    "UP-VST-23": [25, 30, 35, 40, 50, 60, 75, 90, 105, 130],
    "UP-CMB-23": [30, 35, 40, 45, 55, 65, 80, 95, 110, 140],
    "UP-CSQ-23": [10, 15, 20, 25, 35, 45, 60, 75, 95, 120]})


def print_preview():
	with open("preview.tmp", "w", encoding="utf-8") as p:
		p.write(f"{logo}\n\n")
		if tranche == 0:
			p.write(f"Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n")
		elif tranche == 1:
			p.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}er et le {tranche+1}e décile.\n")
		elif 1 <= tranche < 9:
			p.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}e et le {tranche+1}e décile.\n")
		elif tranche == 9:
			p.write(f"Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n")
		p.write(f"\nAfin de garantir une équité tarifaire\n")
		if len(item) > 1:
			p.write(f"les prix ont été ajustés.\n\n")
		else:
			p.write(f"le prix a été ajusté.\n\n")
		for i in range(len(obj)):
			p.write(f"    {obj[i]} {price[i]}€\n")
		p.write(f"\n    TOTAL : {sum(price)}€")
		p.write(f"\n\n\nPour valider la commande scannez\nle code-barres VALIDER.\nPour annuler la commande scannez\nle code-barres ANNULER\n\n.")
			
	print("printing preview ticket")	
	os.system("lpr -P EPSON_TM-T20III preview.tmp -o cpi=16 -o lpi=7")
	os.remove("preview.tmp")
	
	
def print_valid():
	with open("ticket.tmp", "w", encoding="utf-8") as f:
		f.write(f"{logo}\n\n")
		if tranche == 0:
			f.write(f"Vous avez déclaré toucher un revenu\ninférieur au 1er décile.\n")
		elif tranche == 1:
			f.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}er et le {tranche+1}e décile.\n")
		elif 1 < tranche < 9:
			f.write(f"Vous avez déclaré toucher un revenu\ncompris entre le {tranche}e et le {tranche+1}e décile.\n")
		elif tranche == 9:
			f.write(f"Vous avez déclaré toucher un revenu\nsupérieur au 9e décile.\n")
		f.write(f"\nAfin de garantir une équité tarifaire\n")
		if len(item) > 1:
			f.write(f"les prix ont été ajustés.\n\n")
		else:
			f.write(f"le prix a été ajusté.\n\n")
		for i in range(len(obj)):
			f.write(f"    {obj[i]} {price[i]}€\n")
		f.write(f"\n    TOTAL : {sum(price)}€")
		f.write(f"\n\n\nPar cet achat vous contribuez au\nfinancement d'outils de création mutualisés\ndestinés à l'association d'artistes le\nComité des Choses Concrètes.\n\nTickets imprimés en 2 exemplaires,\nfaisant foi d'authenticité.\n\n.")
		
	print("printing client ticket")	
	os.system("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=16 -o lpi=7")
	
	with open("ticket.tmp", "a", encoding="utf-8") as f:
		f.write(f"\n\nExemplaire Union Pragmatique\n\n.")
	sleep(4)
	
	print("printing UP ticket")
	os.system("lpr -P EPSON_TM-T20III ticket.tmp -o cpi=16 -o lpi=7")
	os.remove("ticket.tmp")
	

# exec
logo = ('''
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██ ██ ██ ▄▄ ████ ██ ██ ▄▄ ████ ██ ██ ▄▄ ██
██ ██ ██ ▀▀ ████ ██ ██ ▀▀ ████ ██ ██ ▀▀ ██
██▄▀▀▄██ ███████▄▀▀▄██ ███████▄▀▀▄██ █████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
Union Pragmatique                     2023

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
						e.write(f"{logo}\n\nVeuillez scanner un article en premier.\n\n\n\n\n.")
					os.system("lpr -P EPSON_TM-T20III error.tmp -o cpi=16 -o lpi=7")
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
						
		print_preview()
	
		with open("preview.csv", "a", encoding="utf-8") as t:
			t.write(f"{tranche}; {item}; {price}; {sum(price)}\n")
			
		user_input = input("Validate choice ?\n")			
		if user_input == "VALIDER":
			print_valid()
			
			with open("trace.csv", "a", encoding="utf-8") as t:
				t.write(f"{tranche}; {item}; {price}; {sum(price)}\n")
				
		elif user_input == "ANNULER":
			print("cancel by type")
